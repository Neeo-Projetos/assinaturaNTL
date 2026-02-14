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
                class="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
            >
                <div v-if="loading" class="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="relative z-10">{{ loading ? 'Gerando Assinatura...' : 'Gerar Assinatura' }}</span>
            </button>
          </div>
        </form>

        <!-- Use a hidden div for HTML results if we ever want to bring them back without breaking logic -->
        <div v-if="false">
          <!-- Hidden HTML logic -->
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
        </div>

        <!-- Success Message GIF -->
        <div v-if="gifUrl" class="mt-6 p-6 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-fade-in ring-1 ring-indigo-50 dark:ring-indigo-900/50">
          
          <div class="w-full flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
             <div class="flex items-center gap-2">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <svg class="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                     <h3 class="text-base font-bold text-gray-900 dark:text-white">Assinatura Pronta!</h3>
                     <p class="text-xs text-gray-500">Alta resolução</p>
                </div>
             </div>
             
              <a :href="gifUrl" download class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar
              </a>
          </div>
          
          <div class="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 flex justify-center border border-gray-100 dark:border-gray-800">
             <img :src="gifUrl" class="max-w-full rounded shadow-sm" alt="Generated GIF Signature" />
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
const gifUrl = ref('')
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
  // Clear previous results
  successUrl.value = ''
  permanentLink.value = ''
  error.value = ''
  generatedHtml.value = ''
  gifUrl.value = ''
  
  loading.value = true

  // Artificial delay
  const minLoadTime = new Promise(resolve => setTimeout(resolve, 800))
  
  try {
    // Generate GIF directly
    const request = $fetch('/api/generate-gif', {
      method: 'POST',
      body: { ...form.value, theme: 'light' }
    })

    const [_, data] = await Promise.all([minLoadTime, request])

    if (data && data.success) {
      gifUrl.value = data.dataUri
      // We don't set SuccessURL or PermanentLink as user requested to hide them
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
