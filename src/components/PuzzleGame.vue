<template>
  <div>
    <!-- Story Intro -->
    <StoryIntro v-if="showIntro" @complete="startGame" />

    <!-- Main Game -->
    <div v-else class="game-container">
      <!-- Header avec Timer et Score -->
      <div class="game-header">
        <div class="timer" :class="{ 'warning': formatTime(timeRemaining).isWarning }">⏱️ {{ formatTime(timeRemaining).time }}</div>
        <div class="score">🏆 {{ score }} points</div>
      </div>

      <!-- Zone principale du jeu -->
      <div class="lab-scene">
        <!-- Zones interactives -->
        <div 
          v-for="(zone, index) in zones" 
          :key="index"
          class="interactive-spot"
          :style="{ left: zone.x + '%', top: zone.y + '%' }"
          @mouseover="showHint(zone)"
          @mouseleave="hideHint"
          @click="handleZoneClick(zone)"
        >
          <div class="spot-hint" v-if="zone.showHint">
            {{ zone.hint }}
          </div>
        </div>
      </div>

      <!-- Inventaire -->
      <div class="inventory">
        <h3>🎒 Inventaire</h3>
        <TransitionGroup name="inventory-item" tag="div" class="inventory-items">
          <div 
            v-for="item in inventory" 
            :key="item.id"
            class="inventory-item"
            :class="{ 
              'selected': selectedItem === item,
              'item-collected': item.isNew,
              'item-used': item.isUsed
            }"
            @click="selectItem(item)"
          >
            {{ item.icon }} {{ item.name }}
          </div>
        </TransitionGroup>
      </div>

      <!-- Puzzle Modal -->
      <div v-if="currentPuzzle" class="puzzle-modal" :class="{ 'active': currentPuzzle }">
        <div class="puzzle-content">
          <div class="puzzle-header">
            <h2>{{ currentPuzzle.title || 'Énigme' }}</h2>
            <button class="close-btn" @click="closePuzzle">&times;</button>
          </div>
          
          <img 
            v-if="currentPuzzle.image"
            :src="currentPuzzle.image" 
            :alt="currentPuzzle.title"
            class="puzzle-image"
          />
          
          <p class="puzzle-description">
            {{ currentPuzzle.question || currentPuzzle.description }}
          </p>
          
          <div class="puzzle-interaction">
            <template v-if="currentPuzzle.type === 'code' && !solvedPuzzles.has(currentPuzzle.id)">
              <div class="input-group">
                <input 
                  v-model="userSolution"
                  type="text"
                  placeholder="Entrez le code..."
                  @keyup.enter="submitSolution"
                  ref="puzzleInput"
                >
                <button @click="submitSolution" class="btn-submit">
                  Valider
                </button>
              </div>

              <!-- Section indice séparée -->
              <div class="hint-section" v-if="showHintButton && currentPuzzle.hint">
                <button 
                  @click="showPuzzleHint"
                  class="hint-button"
                >
                  💡 Indice
                </button>
                <div v-if="hintVisible" class="hint-text">
                  {{ currentPuzzle.hint }}
                </div>
              </div>
            </template>
            
            <template v-else-if="currentPuzzle.type === 'solved'">
              <div class="solved-message">
                ✅ Énigme résolue
              </div>
            </template>
            
            <template v-else-if="currentPuzzle.type === 'item_use'">
              <div class="input-group">
                <button 
                  @click="submitSolution" 
                  class="btn-submit"
                  :disabled="!selectedItem"
                >
                  Utiliser {{ selectedItem ? selectedItem.name : 'un objet' }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Message System -->
      <div v-if="message" class="message-system" :class="{ 'error': messageType === 'error' }">
        {{ message }}
      </div>

      <!-- Victory Screen -->
      <div v-if="showVictory" class="victory-screen">
        <div class="victory-content">
          <h2>🎉 Mission Accomplie !</h2>
          <p class="victory-text">Vous avez désactivé la machine temporelle !</p>
          <div class="victory-stats">
            <p>Score final : {{ score }} points</p>
            <p>Temps restant : {{ formatTime(timeRemaining).time }}</p>
          </div>
          <button @click="restartGame" class="btn-restart">
            🏠 Retour à l'accueil
          </button>
        </div>
      </div>

      <!-- Plans Modal -->
      <div v-if="showPlans" class="plans-modal">
        <div class="plans-container">
          <img 
            :src="isZoomed ? zoomedPlansUrl : plansUrl" 
            @click="handlePlansClick($event)"
            class="plans-image"
            :class="{ 'zoomed': isZoomed }"
          />
          <button @click="closePlans" class="close-button">Fermer</button>
        </div>
      </div>

      <!-- Game Over Screen -->
      <div v-if="showGameOver" class="game-over-screen">
        <div class="game-over-content">
          <h2>⏰ Temps écoulé !</h2>
          <p class="game-over-text">Vous n'avez pas réussi à désactiver la machine à temps.</p>
          <div class="game-over-stats">
            <p>Score final : {{ score }} points</p>
          </div>
          <button @click="restartGame" class="btn-restart">
            🔄 Réessayer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useGameStore } from '@/store/game';
import StoryIntro from './StoryIntro.vue';
import gsap from 'gsap';
import { useRouter } from 'vue-router';

const showIntro = ref(true);
const store = useGameStore();
const timeRemaining = ref(600); // 10 minutes
const score = ref(0);
const inventory = ref([]);
const selectedItem = ref(null);
const currentPuzzle = ref(null);
const userSolution = ref('');
const message = ref('');
const showVictory = ref(false);
const router = useRouter();
const showHintButton = ref(false);
const hintVisible = ref(false);
let hintTimer = null;
const solvedPuzzles = ref(new Set());
const showPlans = ref(false);
const isZoomed = ref(false);
const plansUrl = ref("https://cdn.discordapp.com/attachments/1007388269375410236/1336261850873987092/image1.png?ex=67a32a53&is=67a1d8d3&hm=67df3d15102bb5b5bdd6dc7f2018ef15bc486cb142e037641efdccc34b2466a9&");
const zoomedPlansUrl = ref("https://cdn.discordapp.com/attachments/1007388269375410236/1336262049956892715/image.png?ex=67a32a83&is=67a1d903&hm=69ff9f55bc83b2026287931f113c11055480aefa0258cb41e75e3387c2b6029a&");
const messageType = ref('success');
const showGameOver = ref(false);

// Remplacer la déclaration des sons
const sounds = {
  click: new Audio('/sounds/click.wav'),
  success: new Audio('/sounds/success.wav'),
  error: new Audio('/sounds/error.wav'),
  collect: new Audio('/sounds/collect.wav'),
  warning: new Audio('/sounds/warning.wav'),
  gameOver: new Audio('/sounds/game-over.wav')
};

// Précharger les sons
onMounted(() => {
  // Précharger tous les sons
  Object.values(sounds).forEach(sound => {
    sound.load();
    // Réduire le volume
    sound.volume = 0.3;
  });

  // Ajouter un événement de clic pour débloquer l'audio sur iOS/Safari
  document.addEventListener('click', () => {
    Object.values(sounds).forEach(sound => {
      sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
      }).catch(() => {});
    });
  }, { once: true });
});

const zones = ref([
  {
    id: 'computer',
    x: 25,
    y: 40,
    hint: "L'ordinateur du Dr. Marcus",
    type: 'code',
    showHint: true,
    puzzle: {
      title: 'Terminal du Dr. Marcus',
      image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1335976378746535996/image-4.jpg?ex=67a22075&is=67a0cef5&hm=7dd62942c9b26c1f898eef4101ad66aed33fb401d0df6724452be49eeea59da7&',
      question: "Sur l'écran de l'ordinateur du Dr. Marcus, une note qui indique son premier prototype.",
      solution: '1984',
      reward: {
        id: 'usb',
        name: 'Clé USB',
        icon: '💾',
        description: 'Contient des fichiers cryptés'
      }
    }
  },
  {
    id: 'cabinet',
    x: 75,
    y: 35,
    hint: "Une armoire de laboratoire",
    type: 'code',
    puzzle: {
      question: "Compteur Geiger",
      solution: '2207',
      image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1336283010164719637/b3a50d0a-2d98-4eeb-96ca-5f1d17c710c2.jpeg?ex=67a33e08&is=67a1ec88&hm=6de9a1a9c1f46280a4ba612a5d924465979d93b3ef3e9c1f641db05074c190f5&',
      reward: {
        id: 'key',
        name: 'Clé Magnétique',
        icon: '🔑',
        description: 'Permet d\'accéder à des zones sécurisées'
      }
    }
  },
  {
    id: 'safe',
    x: 45,
    y: 60,
    hint: "Un coffre-fort dissimulé",
    type: 'item_use',
    puzzle: {
      title: 'Coffre-fort Sécurisé',
      description: 'Une fente pour carte magnétique est visible. La clé magnétique trouvée dans l\'armoire pourrait fonctionner.',
      image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1336266235536609290/80933cdd-bbac-463c-848e-e679d19e5706.jpeg?ex=67a32e69&is=67a1dce9&hm=3beb15ed8c5bad973398616ad9a402ccbae748e47743f4b0f40e0d4dbaecb3e7&',
      requiredItem: 'Clé Magnétique',
      reward: { 
        id: 'plans',
        name: 'Plans de la Machine',
        icon: '📋',
        description: 'Les plans détaillés de la machine temporelle'
      }
    }
  },
  {
    id: 'machine',
    x: 85,
    y: 55,
    hint: "La machine temporelle",
    type: 'code',
    puzzle: {
      title: 'Code requis',
      question: "Désactiver la machine avant qu'il ne sois trop tard",
      solution: '298518385',
      requiresItem: 'Plans de la Machine',
      image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1336270550003224618/85d26d98-d23e-4688-a22b-da0bd762f363.jpeg?ex=67a3326d&is=67a1e0ed&hm=a1822c3c91c8ce40ec71001c325bafc58bf3326b6e8fd3388904d78e1995e444&',
      isEndGame: true
    }
  }
]);

const selectItem = (item) => {
  selectedItem.value = item;
  showMessage(`${item.name} sélectionné`);
  
  // Si on clique sur les plans dans l'inventaire, les afficher
  if (item.id === 'plans') {
    showPlansImage();
  }
};

const handleZoneClick = (zone) => {
  if (zone.puzzle) {
    // Vérifier si c'est la machine temporelle et si on a les plans
    if (zone.id === 'machine' && !inventory.value.some(item => item.id === 'plans')) {
      showMessage("Vous avez besoin des plans de la machine pour comprendre son fonctionnement", 'error');
      return;
    }

    // Ne vérifier les puzzles résolus que pour les puzzles de type 'code'
    if (zone.type === 'code' && solvedPuzzles.value.has(zone.id)) {
      currentPuzzle.value = {
        ...zone.puzzle,
        id: zone.id,
        title: zone.puzzle.title || 'Énigme résolue',
        description: `Vous avez déjà résolu cette énigme et obtenu : ${zone.puzzle.reward?.name || ''}`,
        type: 'solved',
        image: zone.puzzle.image
      };
      return;
    }

    // Pour les puzzles de type 'item_use', on garde le type original
    const puzzleType = zone.puzzle.type || zone.type;

    // Définir le puzzle sans faire de vérification d'objet ici
    currentPuzzle.value = {
      ...zone.puzzle,
      id: zone.id,
      title: puzzleType === 'code' ? 'Code requis' : 'Un coffre ?',
      description: zone.puzzle.question || zone.puzzle.description,
      type: puzzleType,
      hint: puzzleType === 'code' ? "Indice : L'année de son prototype est visible sur la photo..." : null
    };

    // La vérification de l'objet requis se fera uniquement lors du clic sur le bouton "Utiliser"
    
    nextTick(() => {
      if (puzzleType === 'code') {
        const input = document.querySelector('.puzzle-modal input');
        if (input) input.focus();
      }
    });

    // Reset et démarrage du timer pour l'indice
    if (hintTimer) clearTimeout(hintTimer);
    showHintButton.value = false;
    hintVisible.value = false;
    
    hintTimer = setTimeout(() => {
      showHintButton.value = true;
    }, 60000); // 60000ms = 1 minute
  }
};

const submitSolution = () => {
  if (currentPuzzle.value.type === 'item_use') {
    // Logique pour utiliser un objet
    if (selectedItem.value && selectedItem.value.name === currentPuzzle.value.requiredItem) {
      handleSuccess();
      selectedItem.value = null; // Désélectionne l'objet après utilisation
    } else {
      showMessage("Cet objet ne fonctionne pas ici", 'error');
    }
  } else if (userSolution.value === currentPuzzle.value.solution) {
    handleSuccess();
  } else {
    handleFailure();
  }
};

const handleSuccess = () => {
  gsap.to('.puzzle-content', {
    scale: 1.05,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  });

  if (currentPuzzle.value.id) {
    solvedPuzzles.value.add(currentPuzzle.value.id);
  }

  // Retirer l'objet utilisé de l'inventaire si c'est un puzzle de type 'item_use'
  if (currentPuzzle.value.type === 'item_use' && selectedItem.value) {
    const itemToUse = inventory.value.find(i => i.id === selectedItem.value.id);
    if (itemToUse) {
      itemToUse.isUsed = true;
      setTimeout(() => {
        inventory.value = inventory.value.filter(item => item.id !== selectedItem.value.id);
        selectedItem.value = null;
      }, 500);
    }
  }

  if (currentPuzzle.value.reward) {
    const newItem = {
      ...currentPuzzle.value.reward,
      isNew: true
    };
    inventory.value.push(newItem);
    showMessage(`Vous avez obtenu : ${newItem.name}`);
    
    // Retirer le flag isNew après l'animation
    setTimeout(() => {
      const item = inventory.value.find(i => i.id === newItem.id);
      if (item) item.isNew = false;
    }, 800);

    // Afficher les plans quand on les obtient
    if (currentPuzzle.value.reward.id === 'plans') {
      showPlansImage();
    }
  }

  if (currentPuzzle.value.isEndGame) {
    showVictoryScreen();
  }

  score.value += 100;
  closePuzzle();
};

const handleFailure = () => {
  gsap.to('.puzzle-content', {
    x: [-10, 10, -10, 10, 0],
    duration: 0.4,
    ease: 'power2.inout'
  });
  
  score.value -= 50;
  showMessage("Code incorrect ! (-50 points)", 'error');
};

// Timer
let timerInterval: number;

const startGame = () => {
  showIntro.value = false;
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      // Game Over
      clearInterval(timerInterval);
      handleGameOver();
    }
  }, 1000);
};

onMounted(() => {
  // Démarrer le timer
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      // Game Over
      clearInterval(timerInterval);
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  if (hintTimer) clearTimeout(hintTimer);
});

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  // Jouer le son d'avertissement quand il reste 30 secondes
  if (seconds === 30) {
    sounds.warning.play();
  }
  
  return {
    time: formattedTime,
    isWarning: seconds <= 30
  };
};

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const showVictoryScreen = () => {
  showVictory.value = true;
  clearInterval(timerInterval);
  gsap.to('.victory-screen', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out'
  });
};

const restartGame = () => {
  // Animation de fondu au noir
  gsap.to('.victory-screen', {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      showVictory.value = false;
      // Redirection vers la page des scénarios
      router.push('/scenarios');
    }
  });
};

const closePuzzle = () => {
  currentPuzzle.value = null;
  userSolution.value = '';
};

const showHint = (zone) => {
  zone.showHint = true;
};

const hideHint = () => {
  // Implement the logic to hide the hint
};

const showPuzzleHint = () => {
  hintVisible.value = true;
  score.value -= 25; // Pénalité pour avoir utilisé un indice
  showMessage("Pénalité de -25 points pour l'utilisation d'un indice");
};

const handlePlansClick = (event) => {
  // Calculer la position relative du clic
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Vérifier si le clic est dans la zone en bas à gauche
  // Ajuster ces valeurs selon vos besoins
  if (y > rect.height * 0.7 && x < rect.width * 0.3) {
    isZoomed.value = !isZoomed.value;
  }
};

const showPlansImage = () => {
  showPlans.value = true;
  isZoomed.value = false;
};

const closePlans = () => {
  showPlans.value = false;
  isZoomed.value = false;
};

const handleGameOver = () => {
  showGameOver.value = true;
  gsap.to('.game-over-screen', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out'
  });
};
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('https://cdn.discordapp.com/attachments/1007388269375410236/1336273820344127528/3d1ee4e1-c886-4a12-a30d-6d47165f01e4.jpeg?ex=67a33579&is=67a1e3f9&hm=61b06437280ff75bacd42451e36798c4577bd95980a3aa37a282e18ce83cc651&');
  background-size: cover;
  background-position: center;
  color: white;
}

.game-header {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer, .score {
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.lab-scene {
  flex: 1;
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  background-size: cover;
  background-position: center;
}

.interactive-spot {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(66, 184, 131, 0.2);
  border: 2px solid #42b883;
  cursor: pointer;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 184, 131, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(66, 184, 131, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 184, 131, 0); }
}

.spot-hint {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.inventory {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(13, 13, 23, 0.95);
  border-top: 1px solid var(--border-color);
  z-index: 10;
}

.inventory h3 {
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.inventory-items {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem;
}

.inventory-item {
  flex: 0 0 auto;
  min-width: 120px;
  padding: 0.8rem;
  background: rgba(66, 184, 131, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.inventory-item.selected {
  background: rgba(66, 184, 131, 0.3);
  border-color: #42b883;
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
  transform: translateY(-2px);
}

.inventory-item:hover {
  background: rgba(66, 184, 131, 0.2);
  transform: translateY(-2px);
}

.inventory-item-enter-active,
.inventory-item-leave-active {
  transition: all 0.5s ease;
}

.inventory-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.inventory-item-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-20px);
}

.item-collected {
  animation: collectItem 0.8s ease-out;
}

.item-used {
  animation: useItem 0.8s ease-out;
}

@keyframes collectItem {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes useItem {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8) translateY(-10px);
    opacity: 0.5;
  }
  100% {
    transform: scale(0) translateY(-20px);
    opacity: 0;
  }
}

.puzzle-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 100;
}

.puzzle-modal.active {
  opacity: 1;
  pointer-events: auto;
}

.puzzle-content {
  background-color: rgba(40, 40, 40, 0.95);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  max-width: 350px;
  width: 90%;
  transform: scale(0.9);
  transition: transform 0.3s ease;
  margin-bottom: 100px;
}

.puzzle-modal.active .puzzle-content {
  transform: scale(1);
}

.puzzle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--primary);
  transform: scale(1.1);
}

.puzzle-interaction {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group input {
  flex: 1;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: white;
}

.hint-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.hint-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-text {
  margin-top: 0.5rem;
  color: #42b883;
  font-style: italic;
  text-align: center;
  padding: 0.5rem;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 4px;
  width: 100%;
}

.btn-submit {
  padding: 0.5rem 1rem;
  background: var(--primary);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.message-system {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(66, 184, 131, 0.9);
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.message-system.error {
  background: rgba(220, 53, 69, 0.9);
}

.victory-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;
}

.victory-content {
  background: rgba(13, 13, 23, 0.95);
  padding: 3rem;
  border-radius: 15px;
  border: 2px solid #42b883;
  text-align: center;
  animation: scaleIn 0.5s ease;
  box-shadow: 0 0 50px rgba(66, 184, 131, 0.3);
}

.victory-content h2 {
  font-size: 2.5rem;
  color: #42b883;
  margin-bottom: 1rem;
}

.victory-text {
  font-size: 1.2rem;
  color: white;
  margin-bottom: 2rem;
}

.victory-stats {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.btn-restart {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #42b883;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-restart:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.puzzle-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.solved-message {
  text-align: center;
  color: #42b883;
  font-size: 1.2rem;
  padding: 1rem;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
}

.plans-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.plans-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.plans-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.plans-image.zoomed {
  transform: scale(1.1);
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background: #eee;
}

.game-over-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;
}

.game-over-content {
  background: rgba(13, 13, 23, 0.95);
  padding: 3rem;
  border-radius: 15px;
  border: 2px solid #dc3545;
  text-align: center;
  animation: scaleIn 0.5s ease;
  box-shadow: 0 0 50px rgba(220, 53, 69, 0.3);
}

.game-over-content h2 {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.game-over-text {
  font-size: 1.2rem;
  color: white;
  margin-bottom: 2rem;
}

.game-over-stats {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.btn-restart {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #42b883;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-restart:hover {
  background: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.timer.warning {
  background: rgba(220, 53, 69, 0.8);
  animation: pulse-warning 1s infinite;
}

@keyframes pulse-warning {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style> 