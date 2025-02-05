<template>
  <div class="story-intro">
    <div class="slides-container">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="slide"
        :class="{ 'active': currentSlide === index }"
      >
        <div 
          class="slide-background"
          :style="{
            backgroundImage: `url('${slide.image}')`,
            filter: slide.filter
          }"
        ></div>
        <div class="slide-content">
          <div class="slide-text-container">
            <p class="slide-text" v-html="slide.text"></p>
            <div class="controls">
              <button class="btn-next" @click="nextSlide">
                <span class="btn-text">{{ currentSlide === slides.length - 1 ? 'Entrer dans le laboratoire' : 'Suivant' }}</span>
                <span class="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hint-section">
      <button 
        v-if="showHintButton" 
        @click="showHint"
        class="hint-button"
      >
        Besoin d'un indice ?
      </button>
      <div v-if="hintVisible" class="hint-text">
        Indice : Pensez à un roman dystopique célèbre...
      </div>
    </div>

    <!-- Ajout du modal pour l'image de l'ordinateur -->
    <div v-if="showComputerImage" class="computer-modal" @click="closeComputerImage">
      <div class="computer-image-container">
        <img 
          src="https://cdn.discordapp.com/attachments/1007388269375410236/1335976378746535996/image-4.jpg" 
          alt="Écran d'ordinateur"
          class="computer-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';

const slides = ref([
  {
    image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1335948045140889673/image-3.jpg?ex=67a20612&is=67a0b492&hm=665253da98c96556c742b6acf2438a076f087b05067242c6235b76872750aec2&',
    filter: 'brightness(0.7) saturate(1.2) sepia(0.2)',
    text: "Le Dr. Mathod... Un brillant scientifique devenu fou.<br>Ses expériences sur le temps sont allées trop loin."
  },
  {
    image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1335951579173359669/image-3.jpg?ex=67a2095d&is=67a0b7dd&hm=cc57c6fd6a5892e4ed052b174e6ed7dd7ba5b2f098d2041878586c8b08d9ba2b&',
    filter: 'brightness(0.5) saturate(1.4) hue-rotate(-10deg)',
    text: "Cette nuit, quelque chose s'est produit dans son laboratoire.<br>Des témoins parlent d'une lumière aveuglante..."
  },
  {
    image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1335951579173359669/image-3.jpg?ex=67a2095d&is=67a0b7dd&hm=cc57c6fd6a5892e4ed052b174e6ed7dd7ba5b2f098d2041878586c8b08d9ba2b&',
    filter: 'brightness(0.4) contrast(1.2) saturate(1.5) hue-rotate(10deg)',
    text: "Votre mission : Infiltrer son laboratoire et découvrir la vérité<br>avant qu'il ne soit trop tard pour l'humanité..."
  },
  {
    image: 'https://cdn.discordapp.com/attachments/1007388269375410236/1335976378746535996/image-4.jpg',
    text: 'Un vieil ordinateur attire votre attention... <span class="clickable" @click="showComputer">Cliquez pour examiner</span>',
    filter: 'brightness(0.7) saturate(1.2) sepia(0.2)'
  }
]);

const currentSlide = ref(0);

const nextSlide = () => {
  gsap.to(`.slide:nth-child(${currentSlide.value + 1})`, {
    opacity: 0,
    scale: 0.95,
    duration: 0.5
  });

  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++;
    gsap.fromTo(`.slide:nth-child(${currentSlide.value + 1})`,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.5 }
    );
  } else {
    gsap.to('.story-intro', {
      opacity: 0,
      duration: 1,
      onComplete: () => emit('complete')
    });
  }
};

const emit = defineEmits(['complete']);

const checkGameProgress = () => {
  // Si le joueur a tous les éléments nécessaires
  if (inventory.value.some(item => item.name === 'Plans de la machine') &&
      inventory.value.some(item => item.name === 'Fichiers secrets')) {
    // Victoire !
    showVictoryScreen();
  }
};

const interactiveZones = ref([
  {
    x: 25,
    y: 45,
    hint: "Un ordinateur verrouillé...",
    puzzle: {
      type: 'code',
      title: 'Ordinateur du Dr. Mathod',
      description: 'L\'écran affiche : "Entrez le code d\'accès. Indice : Date importante ?"',
      solution: '1984',
      reward: { name: 'Fichiers secrets' }
    }
  },
  {
    x: 75,
    y: 30,
    hint: "Une armoire mystérieuse...",
    puzzle: {
      type: 'code',
      title: 'Armoire de Laboratoire',
      description: 'Une note : "La combinaison est la masse atomique de l\'élément clé"',
      solution: '2207',
      reward: { name: 'Clé magnétique' }
    }
  },
  {
    x: 50,
    y: 60,
    hint: "Un coffre-fort caché...",
    puzzle: {
      type: 'item_use',
      title: 'Coffre-fort secret',
      description: 'Le coffre nécessite une clé magnétique spéciale...',
      requiredItem: 'Clé magnétique',
      reward: { name: 'Plans de la machine' }
    }
  }
]);

const showHintButton = ref(false);
const hintVisible = ref(false);
const hintTimer = ref(null);

const showHint = () => {
  hintVisible.value = true;
};

const mounted = () => {
  hintTimer.value = setTimeout(() => {
    showHintButton.value = true;
  }, 60000);
};

const beforeDestroy = () => {
  if (hintTimer.value) {
    clearTimeout(hintTimer.value);
  }
};

const showComputerImage = ref(false);

const showComputer = () => {
  showComputerImage.value = true;
};

const closeComputerImage = () => {
  showComputerImage.value = false;
};
</script>

<style scoped>
.story-intro {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1000;
}

.slides-container {
  height: 100vh;
  position: relative;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide.active {
  opacity: 1;
}

.slide-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  transition: transform 10s ease, filter 1s ease;
}

.slide.active .slide-background {
  transform: scale(1);
}

.slide-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 0, 0, 0.7) 40%,
    rgba(0, 0, 0, 0.9)
  );
}

.slide-text {
  color: white;
  font-size: 1.8rem;
  text-align: center;
  line-height: 1.6;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  max-width: 800px;
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.8s forwards 0.5s;
}

.slide-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.controls {
  margin-top: 2rem;
}

.btn-next {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background: rgba(66, 184, 131, 0.2);
  border: 1px solid #42b883;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-next:hover {
  background: rgba(66, 184, 131, 0.4);
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-next:hover .btn-icon {
  transform: translateX(5px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hint-section {
  margin-top: 20px;
  text-align: center;
}

.hint-button {
  background-color: #4a5568;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hint-button:hover {
  background-color: #2d3748;
}

.hint-text {
  margin-top: 10px;
  color: #718096;
  font-style: italic;
}

.clickable {
  cursor: pointer;
  color: #4299e1;
  text-decoration: underline;
}

.computer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.computer-image-container {
  max-width: 90%;
  max-height: 90vh;
}

.computer-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}
</style> 