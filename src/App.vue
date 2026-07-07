<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import HeroSection from './components/HeroSection.vue'
import config from './config.json'

const groups = [
  { id: 'fdm', label: 'Friendly Data Meetup' },
  { id: 'fmaq', label: 'Friendly Meetup for Actuaries and Quants' },
]

const groupIds = groups.map((group) => group.id)
const queryGroups = [
  ...new URLSearchParams(window.location.search).getAll('groups').flatMap((value) => value.split(',')),
]
  .map((value) => value.trim())
  .filter((id) => groupIds.includes(id))
const initialGroups = queryGroups.length ? queryGroups : groupIds

const name = ref('')
const email = ref('')
const signupGroups = ref([...initialGroups])
const submitting = ref(false)
const success = ref(false)
const status = ref('')
const invalidFields = ref({ name: false, email: false })

const submittingQuotes = [
  'Rolling out the welcome mat…',
  'Saving your spot at the table…',
  'Adding you to the friends list…',
  'Polishing your invite…',
  'Warming up a seat for you…',
]
const submittingQuoteIndex = ref(0)
let submittingQuoteTimer

watch(submitting, (active) => {
  clearInterval(submittingQuoteTimer)
  if (!active) {
    submittingQuoteIndex.value = 0
    return
  }
  submittingQuoteIndex.value = 0
  submittingQuoteTimer = setInterval(() => {
    submittingQuoteIndex.value = (submittingQuoteIndex.value + 1) % submittingQuotes.length
  }, 2000)
})

onUnmounted(() => clearInterval(submittingQuoteTimer))

const buttonLabel = computed(() => {
  if (submitting.value) return 'Joining…'
  if (success.value) return 'Joined'
  return 'Join us'
})

const footnote = computed(() => {
  if (status.value) return { class: 'signup-status', text: status.value }
  if (submitting.value) {
    return { class: 'signup-note', text: submittingQuotes[submittingQuoteIndex.value] }
  }
  return { class: 'signup-note', text: 'Become one of our friends today' }
})

const flashInvalid = async (nameEmpty, emailEmpty) => {
  invalidFields.value = { name: false, email: false }
  await nextTick()
  invalidFields.value = { name: nameEmpty, email: emailEmpty }
}

const onInvalidEnd = (field, e) => {
  if (e.animationName !== 'field-invalid-fade') return
  invalidFields.value = { ...invalidFields.value, [field]: false }
}

const onSubmit = async () => {
  status.value = ''
  success.value = false

  const trimmedName = name.value.trim()
  const trimmedEmail = email.value.trim()
  const nameEmpty = !trimmedName
  const emailEmpty = !trimmedEmail

  if (nameEmpty || emailEmpty) {
    await flashInvalid(nameEmpty, emailEmpty)
    if (nameEmpty && emailEmpty) status.value = 'Name and email are required'
    else if (nameEmpty) status.value = 'Please enter your name'
    else status.value = 'Please enter your email'
    return
  }

  if (!signupGroups.value.length) {
    status.value = 'Select at least one group'
    return
  }

  submitting.value = true
  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        groups: signupGroups.value,
      }),
    })
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      status.value = 'Something went wrong. Please try again.'
      return
    }
    if (!res.ok || !data.ok) {
      status.value = data.error || 'Something went wrong. Please try again.'
      return
    }
    const firstName = trimmedName.split(/\s+/)[0]
    status.value = firstName
      ? `Thanks, ${firstName}. You're on the list. See you at the next one!`
      : `Thanks. You're on the list. See you at the next one!`
    success.value = true
    name.value = ''
    email.value = ''
  } catch {
    status.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <HeroSection :hero="config.hero" />

    <section class="signup">
      <div class="inner">
        <h2>Don't miss the next meetup</h2>
        <form novalidate @submit.prevent="onSubmit">
          <label class="sr-only" for="name">Your name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Your name"
            autocomplete="name"
            :class="{ 'field-invalid': invalidFields.name }"
            @animationend="onInvalidEnd('name', $event)"
          />
          <label class="sr-only" for="email">Your email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Your email"
            autocomplete="email"
            :class="{ 'field-invalid': invalidFields.email }"
            @animationend="onInvalidEnd('email', $event)"
          />
          <div class="checks">
            <label v-for="group in groups" :key="group.id">
              <input v-model="signupGroups" type="checkbox" :value="group.id" />
              <span>{{ group.label }}</span>
            </label>
          </div>
          <button
            type="submit"
            :disabled="submitting"
            :class="{ 'is-success': success }"
          >
            {{ buttonLabel }}
          </button>
          <p :class="footnote.class">{{ footnote.text }}</p>
          <p class="signup-privacy">
            You'll only hear from us about the group(s) you select, with meetup invites and the occasional reminder when something is coming up.
            Your details stay private with us. We never spam, share, or sell it.
          </p>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 8rem;
  padding-bottom: 5rem;
}

.page > section {
  width: 100%;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
}

h2 {
  margin: 0;
  text-align: center;
  font-size: 1.35rem;
  font-weight: 600;
}

.signup form {
  display: grid;
  gap: 1.25rem;
  justify-items: center;
  width: 100%;
}

.signup form input[type='text'],
.signup form input[type='email'] {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  color: #111111;
  background: #ffffff;
}

.signup form input[type='text']::placeholder,
.signup form input[type='email']::placeholder {
  color: #8a8a8a;
}

.signup form input.field-invalid {
  animation: field-invalid-fade 5s ease-out;
}

@keyframes field-invalid-fade {
  0% {
    border-color: #e03131;
    background: #fff5f5;
  }

  100% {
    border-color: #d9d9d9;
    background: #ffffff;
  }
}

.checks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.25rem 2.5rem;
}

@media (min-width: 640px) {
  .checks {
    gap: 1.5rem 3rem;
  }
}

.checks label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
  flex: 0 0 calc(1rem + 0.75rem + 21ch);
  width: calc(1rem + 0.75rem + 21ch);
}

.checks label span {
  flex: 1;
  min-width: 0;
  max-width: 21ch;
}

.checks input[type='checkbox'] {
  margin-top: 0;
}

label {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.35;
}

input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  accent-color: #e03131;
  flex-shrink: 0;
}

button[type='submit'] {
  justify-self: center;
  min-width: 10rem;
  margin-top: 1.2rem;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 2rem;
  background: #e03131;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

button[type='submit']:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button[type='submit'].is-success:disabled {
  opacity: 1;
  background: #9ca3af;
  cursor: default;
}

.signup-status {
  margin: 0;
  font-size: 0.95rem;
  color: #6b6b6b;
  text-align: center;
}

.signup-note {
  margin: 0;
  font-size: 0.95rem;
  color: #6b6b6b;
  text-align: center;
}

.signup-privacy {
  margin: 0;
  max-width: 36ch;
  font-size: 0.8rem;
  line-height: 1.45;
  color: #8a8a8a;
  text-align: center;
}

@media (max-width: 639px) {
  .signup {
    padding-bottom: 2.5rem;
  }

  .signup .inner {
    gap: 2.25rem;
  }

  .signup form {
    gap: 1.75rem;
  }

  .signup-note {
    padding-bottom: 0;
  }

  .signup-privacy {
    padding-bottom: 2rem;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
