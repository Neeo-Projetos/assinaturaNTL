<template>
  <div :class="{ 'dark': isDark }">
    <div class="relative min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-gray-50 dark:bg-[#0f1016] text-gray-900 dark:text-white overflow-hidden font-sans">
      
      <!-- Particles Background Removed due to incompatibility -->


      <!-- Main Card -->
      <div class="w-full max-w-lg bg-white dark:bg-[#1a1b26] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-8 relative z-10 transition-colors duration-300">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Gerador de Assinaturas <span class="text-indigo-600 dark:text-indigo-500">NTL</span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Crie sua assinatura profissional em segundos</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="generateSignature" class="space-y-5">
          
          <div class="space-y-1">
            <label for="name" class="block text-sm font-medium text-gray-400">Nome Completo</label>
            <input
              v-model="form.name"
              id="name"
              type="text"
              required
              placeholder="Ex: João Silva"
              class="block w-full px-4 py-3 bg-gray-50 dark:bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-shadow"
            />
          </div>

          <div class="space-y-1">
            <label for="role" class="block text-sm font-medium text-gray-400">Cargo</label>
            <input
              v-model="form.role"
              id="role"
              type="text"
              required
              placeholder="Ex: Desenvolvedor Senior"
              class="block w-full px-4 py-3 bg-gray-50 dark:bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-shadow"
            />
          </div>

          <div class="space-y-1">
            <label for="email" class="block text-sm font-medium text-gray-400">Email</label>
            <input
              v-model="form.email"
              id="email"
              type="email"
              required
              placeholder="email@exemplo.com"
              class="block w-full px-4 py-3 bg-gray-50 dark:bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-shadow"
            />
          </div>

          <div class="space-y-1">
            <label for="phone" class="block text-sm font-medium text-gray-400">Telefone (Opcional)</label>
            <input
              v-model="form.phone"
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              class="block w-full px-4 py-3 bg-gray-50 dark:bg-white text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-shadow"
            />
          </div>

          <!-- Buttons -->
          <div>
            <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando HTML...
                </span>
                <span v-else>Gerar HTML</span>
            </button>

            <!-- <button
                type="button"
                @click="generateGif"
                :disabled="loading || generatingGif"
                class="w-full py-3.5 px-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                <span v-if="generatingGif" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando GIF...
                </span>
                <span v-else>Gerar GIF</span>
            </button> -->
          </div>
        </form>

        <!-- Success Message HTML -->
        <div v-if="successUrl" class="mt-6 space-y-4 animate-fade-in">
          
          <!-- Success Message -->
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-xl flex items-start gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-green-800 dark:text-green-400">Assinatura HTML gerada!</h3>
              <a :href="successUrl" target="_blank" class="mt-1 block text-sm text-green-700 dark:text-green-300 underline hover:text-green-600 dark:hover:text-green-200">
                Visualizar e Baixar Arquivo
              </a>
            </div>
          </div>

          <!-- Permanent Link Section -->
          <div v-if="permanentLink" class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
             
             <!-- Copy HTML Button -->
             <button 
                @click="copyHtml"
                class="w-full py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg shadow hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
             >
                <svg v-if="!copiedHtml" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ copiedHtml ? 'Código HTML Copiado!' : 'Copiar Código HTML' }}
             </button>

             <div>
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Link Permanente (Dados na URL)</label>
                <div class="flex items-center gap-2">
                    <input 
                    readonly 
                    :value="permanentLink" 
                    class="flex-1 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none"
                    @click="($event.target as HTMLInputElement).select()"
                    />
                    <button 
                    @click="copyLink"
                    class="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    title="Copiar Link"
                    >
                    <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    </button>
                </div>
             </div>
          </div>

        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
           <div class="flex-shrink-0 mt-0.5">
            <svg class="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
           <div>
            <h3 class="text-sm font-semibold text-red-800 dark:text-red-400">Erro ao gerar assinatura</h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-8 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-600">
                © 2024 NTL Technologies. Todos os direitos reservados.
            </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const form = ref({
  name: '',
  role: '',
  email: '',
  phone: ''
})

const loading = ref(false)
const successUrl = ref('')
const generatedHtml = ref('')
const permanentLink = ref('')
const error = ref('')
const isDark = ref(false) // Always light
const copied = ref(false)
const copiedHtml = ref(false)

const copyLink = () => {
  navigator.clipboard.writeText(permanentLink.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
    // Force light mode
    isDark.value = false;
})

const generateSignature = async () => {
  // Clear previous results immediately for better feedback
  successUrl.value = ''
  permanentLink.value = ''
  error.value = ''
  generatedHtml.value = ''
  
  loading.value = true

  // Artificial delay to ensure user sees the loading state (UI UX)
  // This helps when the API is too fast
  const minLoadTime = new Promise(resolve => setTimeout(resolve, 800))
  
  // Force Theme Light
  // The user requested to always use light mode
  // We don't send theme param or send 'light'
  
  try {
    const request = $fetch('/api/generate', {
      method: 'POST',
      body: { ...form.value, theme: 'light' }
    })

    const [_, data] = await Promise.all([minLoadTime, request])

    if (data && data.success) {
      // Create a Blob from the HTML content for preview/download
      const blob = new Blob([data.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      successUrl.value = url
      generatedHtml.value = data.html

      // Generate Permanent Link
      const baseUrl = window.location.origin
      const params = new URLSearchParams({
        name: form.value.name,
        role: form.value.role,
        email: form.value.email,
        phone: form.value.phone,
        theme: 'light'
      })
      permanentLink.value = `${baseUrl}/assinatura?${params.toString()}`

    } else {
        error.value = 'Houve um erro desconhecido.'
    }
  } catch (e: any) {
    error.value = e.message || 'Erro ao comunicar com o servidor.'
  } finally {
    loading.value = false
  }
}

const copyHtml = () => {
  navigator.clipboard.writeText(generatedHtml.value)
  copiedHtml.value = true
  setTimeout(() => copiedHtml.value = false, 2000)
}


</script>

<style>
/* Smooth transition for theme toggle */
</style>
