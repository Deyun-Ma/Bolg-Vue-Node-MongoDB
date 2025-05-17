<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = ref<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    extensions: [
      StarterKit,
    ],
    onUpdate: () => {
      emit('update:modelValue', editor.value?.getHTML() || '')
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none',
      },
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(() => props.modelValue, (newContent) => {
  const editorContent = editor.value?.getHTML()
  
  if (newContent !== editorContent) {
    editor.value?.commands.setContent(newContent, false)
  }
})

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run()
}

const toggleHeading = (level: 1 | 2 | 3) => {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = () => {
  editor.value?.chain().focus().toggleBulletList().run()
}

const toggleOrderedList = () => {
  editor.value?.chain().focus().toggleOrderedList().run()
}

const toggleBlockquote = () => {
  editor.value?.chain().focus().toggleBlockquote().run()
}

const isActive = (type: string, options = {}) => {
  if (!editor.value) return false
  
  return editor.value.isActive(type, options)
}
</script>

<template>
  <div class="rich-text-editor border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
    <div class="flex flex-wrap items-center bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-700">
      <button 
        type="button" 
        @click="toggleHeading(1)" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('heading', { level: 1 }) }"
      >
        <span class="font-bold text-lg">H1</span>
      </button>
      
      <button 
        type="button" 
        @click="toggleHeading(2)" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('heading', { level: 2 }) }"
      >
        <span class="font-bold">H2</span>
      </button>
      
      <button 
        type="button" 
        @click="toggleHeading(3)" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('heading', { level: 3 }) }"
      >
        <span class="font-bold text-sm">H3</span>
      </button>
      
      <span class="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></span>
      
      <button 
        type="button" 
        @click="toggleBold" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('bold') }"
      >
        <span class="font-bold">B</span>
      </button>
      
      <button 
        type="button" 
        @click="toggleItalic" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('italic') }"
      >
        <span class="italic">I</span>
      </button>
      
      <span class="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></span>
      
      <button 
        type="button" 
        @click="toggleBulletList" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('bulletList') }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <button 
        type="button" 
        @click="toggleOrderedList" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('orderedList') }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </button>
      
      <button 
        type="button" 
        @click="toggleBlockquote" 
        class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
        :class="{ 'bg-gray-200 dark:bg-gray-700': isActive('blockquote') }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
    
    <div class="bg-white dark:bg-gray-900 min-h-[200px]">
      <EditorContent :editor="editor" class="p-4" />
    </div>
  </div>
</template>

<style>
/* Add basic TipTap styles */
.ProseMirror {
  min-height: 200px;
}

.ProseMirror:focus {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Prose styling */
.prose h1 {
  font-size: 1.75rem;
  line-height: 1.2;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.prose h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.prose h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 0.75em;
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  font-style: italic;
  margin: 1em 0;
}
</style>