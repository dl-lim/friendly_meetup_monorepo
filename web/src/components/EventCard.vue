<script setup>
defineProps({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, default: '' },
  link: { type: String, required: true },
})
</script>

<template>
  <article class="card">
    <div class="image" :class="{ photo: image }" :style="image ? { backgroundImage: `url(${image})` } : undefined" aria-hidden="true" />
    <div class="body">
      <h3>{{ title }}</h3>
      <ul>
        <li>
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          {{ location }}
        </li>
        <li>
          <i class="fa-solid fa-calendar-days" aria-hidden="true"></i>
          {{ date }}
        </li>
        <li>
          <i class="fa-solid fa-clock" aria-hidden="true"></i>
          {{ time }}
        </li>
      </ul>
      <a :href="link" target="_blank" rel="noopener noreferrer">RSVP</a>
    </div>
  </article>
</template>

<style scoped>
.card {
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
}

.image {
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #f3f3f3, #e6e6e6);
}

.image.photo {
  background-size: cover;
  background-position: center;
}

.body {
  padding: 1.25rem;
}

h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
}

ul {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6b6b6b;
}

i {
  width: 1rem;
  font-size: 1rem;
  color: #8a8a8a;
  text-align: center;
  flex-shrink: 0;
}

a {
  display: block;
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: #e03131;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
</style>
