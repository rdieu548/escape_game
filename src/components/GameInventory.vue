<template>
  <div class="inventory-container">
    <h3>Inventaire</h3>
    <div class="inventory-grid">
      <div v-for="item in inventory" :key="item.id" class="inventory-item" @click="selectItem(item)">
        <img :src="item.image" :alt="item.name">
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/store/game';
import type { InventoryItem } from '@/types/game';

const store = useGameStore();
const inventory = computed(() => store.inventory);

const selectItem = (item: InventoryItem) => {
  // Émettre un événement pour indiquer qu'un objet a été sélectionné
  emit('itemSelected', item);
};
</script>

<style scoped>
.inventory-container {
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.inventory-item {
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.inventory-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.inventory-item img {
  width: 100%;
  height: auto;
}
</style> 