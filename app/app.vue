<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f7efe4,_#eef2f7_45%,_#f8fafc)] px-4 py-8 text-slate-900">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section class="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <div class="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="border-b border-slate-200/80 p-8 lg:border-b-0 lg:border-r">
            <p class="mb-3 inline-flex items-center rounded-full bg-[#f4ede1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#996c2f]">
              Assinatura universal
            </p>
            <h1 class="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Gerador hibrido da assinatura NTL
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Os dados ficam em texto real para copiar e colar. A arte da direita sai em GIF publico com fallback no primeiro frame para Roundcube, Gmail, Outlook e Apple Mail.
            </p>

            <form class="mt-8 space-y-5 " @submit.prevent="generateSignature">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-medium text-slate-700">Nome completo</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Ex: Joao Silva"
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                />
              </div>

              <div class="space-y-2">
                <label for="role" class="block text-sm font-medium text-slate-700">Cargo (Opcional)</label>
                <input
                  id="role"
                  v-model="form.role"
                  type="text"
                  placeholder="Ex: Analista Comercial"
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                />
              </div>

              <div class="space-y-2">
                <label for="department" class="block text-sm font-medium text-slate-700">Departamento (Opcional)</label>
                <input
                  id="department"
                  v-model="form.department"
                  type="text"
                  placeholder="Ex: Operacoes"
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                />
              </div>

              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-slate-700">E-mail</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="nome@ntl.com.br"
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                />
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="phone1" class="block text-sm font-medium text-slate-700">Telefone 1 (Opcional)</label>
                  <input
                    id="phone1"
                    v-model="form.phone1"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                  />
                </div>

                <div class="space-y-2">
                  <label for="phone2" class="block text-sm font-medium text-slate-700">Telefone 2 (Opcional)</label>
                  <input
                    id="phone2"
                    v-model="form.phone2"
                    type="tel"
                    placeholder="(11) 3333-4444"
                    class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                  />
                </div>

                <div class="space-y-2">
                  <label for="phone3" class="block text-sm font-medium text-slate-700">Telefone 3 (Opcional)</label>
                  <input
                    id="phone3"
                    v-model="form.phone3"
                    type="tel"
                    placeholder="(11) 4000-5000"
                    class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                  />
                </div>

                <div class="space-y-2">
                  <label for="whatsapp" class="block text-sm font-medium text-slate-700">WhatsApp (Opcional)</label>
                  <input
                    id="whatsapp"
                    v-model="form.whatsapp"
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#996c2f] focus:bg-white focus:ring-4 focus:ring-[#f4ede1]"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {{ loading ? 'Preparando HTML...' : 'Gerar HTML compativel' }}
                </button>

                <button
                  type="button"
                  :disabled="loading"
                  class="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="copyHtml"
                >
                  {{ copiedHtml ? 'HTML copiado' : 'Copiar HTML' }}
                </button>
              </div>
            </form>

            <div class="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 font-medium"
                :class="isOutdated ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
              >
                {{ isOutdated ? 'Atualize o HTML antes de copiar' : 'HTML sincronizado com o formulario' }}
              </span>
              <span class="text-slate-500">A arte animada usa URL publica do projeto quando a assinatura estiver publicada.</span>
            </div>

            <div v-if="error" class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ error }}
            </div>
          </div>

          <div class="bg-[linear-gradient(180deg,_#fffdf8,_#f8fafc)] p-8">
            <div class="rounded-[28px] border border-[#ece7dd] bg-white p-6 shadow-[0_18px_50px_rgba(148,163,184,0.14)]">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Uso no Roundcube</p>
              <ol class="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>1. Em <strong>Settings &gt; Identities</strong>, abra a identidade e marque <strong>HTML signature</strong>.</li>
                <li>2. Em <strong>Preferences &gt; Composing Messages</strong>, deixe a composicao em HTML ativada.</li>
                <li>3. Clique em <strong>Copiar HTML</strong> aqui e cole no campo de assinatura.</li>
                <li>4. Se o cliente bloquear imagens remotas, o texto continua legivel e o primeiro quadro do GIF segue valido.</li>
                <li>5. No editor do Roundcube podem aparecer guias tracejadas durante a edicao; no envio a assinatura usa o card arredondado do HTML.</li>
              </ol>
            </div>

            <div class="mt-5 rounded-[28px] border border-[#e7edf3] bg-slate-950 p-6 text-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Compatibilidade alvo</p>
              <p class="mt-3 text-sm leading-6 text-slate-300">
                Roundcube, Gmail web, Outlook desktop/web e Apple Mail. O HTML gerado usa tabela e estilos inline, sem dependencia de JavaScript.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div class="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-950">Previa hibrida</h2>
            <p class="text-sm text-slate-500">Um unico card envolve tudo: texto selecionavel a esquerda e GIF a direita.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Se o GIF nao animar no cliente, o primeiro quadro permanece valido.
          </span>
        </div>

        <div class="overflow-x-auto bg-[#f7f8fa] p-6">
          <div class="inline-grid grid-cols-[348px_1px_182px] overflow-hidden rounded-[28px] border border-[#dfe4ea] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div class="select-text bg-white px-7 py-5">
              <div class="text-[26px] font-bold leading-[1.08] text-slate-950">
                {{ previewSignature.name }}
              </div>
              <div v-if="previewSignature.role" class="mt-2 text-[15px] leading-6 text-slate-500">
                {{ previewSignature.role }}
              </div>
              <div v-if="previewSignature.department" class="text-[14px] leading-6 text-slate-400">
                {{ previewSignature.department }}
              </div>
              <div class="mt-4 space-y-1 text-[14px] leading-[22px] text-slate-800">
                <div v-if="previewSignature.phone1">{{ previewSignature.phone1 }}</div>
                <div v-if="previewSignature.phone2">{{ previewSignature.phone2 }}</div>
                <div v-if="previewSignature.phone3">{{ previewSignature.phone3 }}</div>
                <div v-if="previewSignature.whatsapp" class="text-[#14804a]">WhatsApp: {{ previewSignature.whatsapp }}</div>
                <div class="text-[#0f4c81]">{{ previewSignature.email }}</div>
              </div>
            </div>
            <div class="bg-[#e7ebf0]"></div>
            <div class="flex items-center justify-center bg-white px-1 py-3">
              <img
                :src="brandGifUrl"
                alt="NTL Nova Tecnologia"
                class="mx-auto block w-[170px] max-w-[170px]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface SignatureForm {
  name: string
  role: string
  department: string
  email: string
  phone1: string
  phone2: string
  phone3: string
  whatsapp: string
}

interface SignatureResponse {
  success: boolean
  html: string
  filename: string
  brandGifUrl?: string
}

const form = ref<SignatureForm>({
  name: '',
  role: '',
  department: '',
  email: '',
  phone1: '',
  phone2: '',
  phone3: '',
  whatsapp: ''
})

const loading = ref(false)
const generatedHtml = ref('')
const error = ref('')
const copiedHtml = ref(false)
const brandGifUrl = ref('/ntl.gif?v=20260309173500')
const lastGeneratedSnapshot = ref('')

const normalizeForm = (value: SignatureForm) => ({
  name: value.name.trim(),
  role: value.role.trim(),
  department: value.department.trim(),
  email: value.email.trim(),
  phone1: value.phone1.trim(),
  phone2: value.phone2.trim(),
  phone3: value.phone3.trim(),
  whatsapp: value.whatsapp.trim()
})

const serializePayload = (value: ReturnType<typeof normalizeForm>) => JSON.stringify(value)

const currentPayload = computed(() => normalizeForm(form.value))

const previewSignature = computed(() => ({
  name: currentPayload.value.name || 'Joao Silva',
  role: currentPayload.value.role,
  department: currentPayload.value.department,
  email: currentPayload.value.email || 'joao@ntl.com.br',
  phone1: currentPayload.value.phone1,
  phone2: currentPayload.value.phone2,
  phone3: currentPayload.value.phone3,
  whatsapp: currentPayload.value.whatsapp
}))

const isOutdated = computed(
  () => !generatedHtml.value || lastGeneratedSnapshot.value !== serializePayload(currentPayload.value)
)

const writeClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const loadSignatureHtml = async () => {
  const payload = currentPayload.value
  const minLoadTime = new Promise((resolve) => setTimeout(resolve, 300))
  const request = $fetch<SignatureResponse>('/api/generate', {
    method: 'POST',
    body: payload
  })

  const [, response] = await Promise.all([minLoadTime, request])

  if (!response?.success || !response.html) {
    throw new Error('Nao foi possivel gerar o HTML da assinatura.')
  }

  generatedHtml.value = response.html
  brandGifUrl.value = response.brandGifUrl || '/ntl.gif?v=20260309173500'
  lastGeneratedSnapshot.value = serializePayload(payload)
}

const generateSignature = async () => {
  error.value = ''
  copiedHtml.value = false
  loading.value = true

  try {
    await loadSignatureHtml()
  } catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError.message : 'Erro ao comunicar com o servidor.'
  } finally {
    loading.value = false
  }
}

const copyHtml = async () => {
  error.value = ''
  loading.value = true

  try {
    if (isOutdated.value) {
      await loadSignatureHtml()
    }

    await writeClipboard(generatedHtml.value)
    copiedHtml.value = true
    setTimeout(() => {
      copiedHtml.value = false
    }, 2000)
  } catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError.message : 'Nao foi possivel copiar o HTML.'
  } finally {
    loading.value = false
  }
}
</script>
