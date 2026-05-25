<template>
  <div class="max-w-5xl mx-auto px-6 py-24">
    <!-- Page header -->
    <div class="text-center mb-16">
      <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: #C5A880;">Find Us</p>
      <h2 class="font-serif text-5xl sm:text-6xl" style="color: #EAE6DF; font-style: italic; font-weight: 300;">
        Information
      </h2>
      <div class="flex items-center justify-center gap-4 mt-6">
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
        <span class="block w-1 h-1 rounded-full" style="background-color: #C5A880; opacity: 0.6;"></span>
        <span class="block h-px w-16" style="background-color: #C5A880; opacity: 0.4;"></span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-px" style="border: 1px solid #2E2823;">
      <!-- Hours -->
      <div class="p-10" style="border-right: 1px solid #2E2823;">
        <h3 class="font-serif text-2xl mb-8" style="color: #C5A880; font-style: italic; font-weight: 300;">
          Hours
        </h3>
        <ul class="flex flex-col gap-4">
          <li
            v-for="item in hours"
            :key="item.day"
            class="flex justify-between items-baseline text-sm"
          >
            <span class="tracking-wider" style="color: #EAE6DF;">{{ item.day }}</span>
            <span class="tracking-widest" style="color: #C8C2B8; font-size: 0.75rem;">{{ item.time }}</span>
          </li>
        </ul>
      </div>

      <!-- Visit guide -->
      <div class="p-10">
        <h3 class="font-serif text-2xl mb-8" style="color: #C5A880; font-style: italic; font-weight: 300;">
          For Guests
        </h3>
        <ul class="flex flex-col gap-5">
          <li
            v-for="note in notes"
            :key="note"
            class="flex gap-4 text-sm leading-7"
            style="color: #C8C2B8;"
          >
            <span style="color: #C5A880; flex-shrink: 0;">—</span>
            <span>{{ note }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Location note -->
    <div class="mt-12 text-center">
      <p class="text-xs tracking-[0.2em] uppercase mb-3" style="color: #C8C2B8;">Location</p>
      <p class="font-serif text-xl" style="color: #EAE6DF; font-style: italic; font-weight: 300;">
        서울특별시 마포구 &nbsp;·&nbsp; 정확한 위치는 예약 후 안내드립니다
      </p>
    </div>
  </div>
</template>

<script setup>
const hours = [
  { day: 'Monday', time: 'Closed' },
  { day: 'Tuesday – Thursday', time: '7 PM – 12 AM' },
  { day: 'Friday – Saturday', time: '7 PM – 2 AM' },
  { day: 'Sunday', time: '6 PM – 11 PM' },
]

const notes = [
  '이 공간은 지인과 지인의 소개로만 방문이 가능합니다.',
  '방문 전 사전 예약을 통해 자리를 확보해 주세요.',
  '시끄러운 대화나 과도한 음주는 정중히 자제 부탁드립니다.',
  '한 자리 최대 4인, 조용하고 차분한 분위기를 함께 만들어 주세요.',
  '21세 미만 입장 불가합니다. 신분증을 지참해 주세요.',
]
</script>
