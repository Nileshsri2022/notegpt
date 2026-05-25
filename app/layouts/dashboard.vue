<template>
  <div class="min-h-screen flex">
    <AppSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardTopBar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
