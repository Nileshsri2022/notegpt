<template>
  <div class="min-h-screen flex bg-gray-50/50">
    <AppSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardTopBar />
      <slot name="header" />
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
