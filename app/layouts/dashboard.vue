<template>
  <div class="min-h-screen flex bg-gray-50/50">
    <AppSidebar ref="sidebarRef" />
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardTopBar @toggle-mobile-sidebar="toggleMobileSidebar" />
      <slot name="header" />
      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarRef = ref<{ mobileOpen: boolean } | null>(null)

function toggleMobileSidebar() {
  if (sidebarRef.value) {
    sidebarRef.value.mobileOpen = !sidebarRef.value.mobileOpen
  }
}
</script>
