<template>
  <svg viewBox="0 0 300 390" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="display:block;">
    <defs>
      <!-- Watercolor displacement filter: makes edges look hand-painted -->
      <filter :id="`wc-${uid}`" x="-40%" y="-40%" width="180%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="4" :seed="filterSeed" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <!-- Softer blur filter for secondary blobs -->
      <filter :id="`blur-${uid}`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>
    </defs>

    <!-- ── Watercolor wash blobs ── -->
    <g style="pointer-events:none;">
      <ellipse :filter="`url(#wc-${uid})`"
        cx="148" cy="188" rx="98" ry="112"
        :fill="palette.c1" style="opacity:0.20;"/>
      <ellipse :filter="`url(#wc-${uid})`"
        cx="172" cy="155" rx="68" ry="78"
        :fill="palette.c2" style="opacity:0.15;"/>
      <ellipse :filter="`url(#wc-${uid})`"
        cx="118" cy="228" rx="60" ry="58"
        :fill="palette.c3" style="opacity:0.12;"/>
      <!-- extra accent splatter -->
      <ellipse :filter="`url(#blur-${uid})`"
        :cx="palette.sx" :cy="palette.sy" rx="38" ry="30"
        :fill="palette.c1" style="opacity:0.09;"/>
    </g>

    <!-- ── GLASS: Martini ── -->
    <g v-if="glass === 'martini'" fill="none">
      <path d="M 80,62 L 220,62 L 152,216 Z"
        :fill="`${palette.c1}22`" :stroke="ink" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M 93,86 L 207,86 L 152,216 Z"
        :fill="`${palette.c1}50`"/>
      <line x1="152" y1="216" x2="152" y2="306" :stroke="ink" stroke-width="1.3"/>
      <path d="M 118,306 Q 118,320 152,320 Q 186,320 186,306"
        :stroke="ink" stroke-width="1.3"/>
      <!-- olive on pick -->
      <line x1="138" y1="62" x2="166" y2="82" :stroke="ink" stroke-width="0.9" opacity="0.6"/>
      <ellipse cx="166" cy="85" rx="7" ry="5.5"
        :fill="`${palette.c2}AA`" :stroke="ink" stroke-width="0.8"/>
      <!-- glass highlight -->
      <line x1="100" y1="75" x2="125" y2="178"
        stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- ── GLASS: Rocks / Old Fashioned ── -->
    <g v-else-if="glass === 'rocks'" fill="none">
      <path d="M 98,128 L 94,298 L 206,298 L 202,128 Z"
        :fill="`${palette.c1}18`" :stroke="ink" stroke-width="1.3"/>
      <path d="M 100,148 L 96,298 L 204,298 L 200,148 Z"
        :fill="`${palette.c1}48`"/>
      <!-- ice cubes -->
      <rect x="116" y="162" width="30" height="27" rx="5"
        fill="rgba(220,240,255,0.22)" :stroke="ink" stroke-width="0.75" opacity="0.75"/>
      <rect x="153" y="156" width="33" height="30" rx="5"
        fill="rgba(220,240,255,0.22)" :stroke="ink" stroke-width="0.75" opacity="0.75"/>
      <!-- orange peel garnish -->
      <path d="M 98,138 Q 140,124 178,140"
        :stroke="palette.c2" stroke-width="2" fill="none" opacity="0.65" stroke-linecap="round"/>
      <!-- highlight -->
      <line x1="108" y1="150" x2="108" y2="280"
        stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- ── GLASS: Highball ── -->
    <g v-else-if="glass === 'highball'" fill="none">
      <path d="M 112,70 L 108,298 L 192,298 L 188,70 Z"
        :fill="`${palette.c1}18`" :stroke="ink" stroke-width="1.3"/>
      <path d="M 114,84 L 110,298 L 190,298 L 186,84 Z"
        :fill="`${palette.c1}48`"/>
      <!-- straw -->
      <line x1="170" y1="52" x2="176" y2="295"
        :stroke="palette.c2" stroke-width="4" stroke-linecap="round" opacity="0.82"/>
      <!-- bubbles -->
      <circle cx="133" cy="138" r="3.2" :fill="palette.c3" opacity="0.38"/>
      <circle cx="158" cy="178" r="2.5" :fill="palette.c3" opacity="0.30"/>
      <circle cx="140" cy="225" r="2" :fill="palette.c3" opacity="0.34"/>
      <circle cx="162" cy="258" r="1.8" :fill="palette.c3" opacity="0.28"/>
      <!-- lime wedge on rim -->
      <path d="M 188,78 Q 206,58 218,78 Q 206,94 188,78 Z"
        :fill="`${palette.c2}70`" :stroke="ink" stroke-width="0.8"/>
      <!-- highlight -->
      <line x1="120" y1="85" x2="120" y2="288"
        stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- ── GLASS: Margarita ── -->
    <g v-else-if="glass === 'margarita'" fill="none">
      <path d="M 62,94 L 238,94 L 194,178 L 168,200 L 152,206 L 132,200 L 106,178 Z"
        :fill="`${palette.c1}18`" :stroke="ink" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M 65,108 L 235,108 L 193,178 L 166,199 L 152,205 L 134,199 L 107,178 Z"
        :fill="`${palette.c1}50`"/>
      <!-- salt rim -->
      <path d="M 62,94 Q 150,80 238,94"
        stroke="rgba(255,255,255,0.35)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- stem -->
      <line x1="152" y1="206" x2="152" y2="306" :stroke="ink" stroke-width="1.3"/>
      <path d="M 118,306 Q 118,320 152,320 Q 186,320 186,306"
        :stroke="ink" stroke-width="1.3"/>
      <!-- lime slice -->
      <ellipse cx="225" cy="100" rx="18" ry="14"
        :fill="`${palette.c2}65`" :stroke="ink" stroke-width="0.8"/>
      <line x1="207" y1="100" x2="243" y2="100" :stroke="ink" stroke-width="0.6" opacity="0.5"/>
      <line x1="225" y1="86" x2="225" y2="114" :stroke="ink" stroke-width="0.6" opacity="0.5"/>
    </g>

    <!-- ── GLASS: Wine ── -->
    <g v-else-if="glass === 'wine'" fill="none">
      <path d="M 104,62 Q 72,148 112,218 L 192,218 Q 232,148 196,62 Z"
        :fill="`${palette.c1}18`" :stroke="ink" stroke-width="1.3"/>
      <path d="M 108,78 Q 78,152 115,215 L 185,215 Q 222,152 192,78 Z"
        :fill="`${palette.c1}40`"/>
      <line x1="152" y1="218" x2="152" y2="305" :stroke="ink" stroke-width="1.3"/>
      <path d="M 120,305 Q 120,320 152,320 Q 184,320 184,305"
        :stroke="ink" stroke-width="1.3"/>
      <!-- wine legs -->
      <path d="M 126,185 Q 145,172 138,155"
        :stroke="palette.c1" stroke-width="0.9" fill="none" opacity="0.4"/>
      <path d="M 175,192 Q 160,178 166,158"
        :stroke="palette.c1" stroke-width="0.9" fill="none" opacity="0.4"/>
      <!-- highlight -->
      <path d="M 120,75 Q 118,140 122,210"
        stroke="rgba(255,255,255,0.22)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>

    <!-- ── GLASS: Shot (fallback) ── -->
    <g v-else fill="none">
      <path d="M 116,142 L 112,298 L 188,298 L 184,142 Z"
        :fill="`${palette.c1}18`" :stroke="ink" stroke-width="1.3"/>
      <path d="M 118,158 L 114,298 L 186,298 L 182,158 Z"
        :fill="`${palette.c1}55`"/>
      <line x1="124" y1="155" x2="124" y2="288"
        stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- ── Ingredient labels (max 6, alternating left/right) ── -->
    <g font-family="'Cormorant Garamond', Georgia, serif" font-style="italic"
       :fill="ink" font-size="10.5">
      <template v-for="(label, i) in displayLabels" :key="i">
        <line
          :x1="labelPos[i].lx1" :y1="labelPos[i].ly"
          :x2="labelPos[i].lx2" :y2="labelPos[i].ly"
          :stroke="ink" stroke-width="0.7" opacity="0.45"/>
        <text
          :x="labelPos[i].tx" :y="labelPos[i].ly + 4"
          :text-anchor="labelPos[i].anchor"
          opacity="0.78">{{ label }}</text>
      </template>
    </g>

    <!-- ── Decorative divider above name ── -->
    <g opacity="0.35" :fill="palette.c1">
      <circle cx="130" cy="342" r="1.8"/>
      <circle cx="150" cy="339" r="1.4"/>
      <circle cx="170" cy="342" r="1.8"/>
    </g>
    <line x1="105" y1="342" x2="122" y2="342" :stroke="palette.c1" stroke-width="0.7" opacity="0.3"/>
    <line x1="178" y1="342" x2="195" y2="342" :stroke="palette.c1" stroke-width="0.7" opacity="0.3"/>

    <!-- ── Cocktail name in script font ── -->
    <text
      x="150" y="368"
      text-anchor="middle"
      font-family="'Dancing Script', 'Cormorant Garamond', cursive"
      font-size="21"
      font-weight="600"
      :fill="ink"
      opacity="0.88">{{ name }}</text>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  category: { type: String, default: '' },
  ingredients: { type: Array, default: () => [] },
  uid: { type: [String, Number], default: 0 },
})

const ink = '#4A3728'

const palettes = {
  'martinis':          { c1:'#7A8FAF', c2:'#9BACC8', c3:'#D4C9E8', sx:200, sy:130, glass:'martini' },
  'bourbon-cocktails': { c1:'#C4823A', c2:'#D4A86A', c3:'#E8C88A', sx:88,  sy:240, glass:'rocks'   },
  'mixed-drinks':      { c1:'#5A9FAF', c2:'#8AC0B8', c3:'#C4D8B0', sx:210, sy:240, glass:'highball' },
  'margarita':         { c1:'#6AAF5A', c2:'#A4C47A', c3:'#D8E890', sx:90,  sy:250, glass:'margarita'},
  'sangria':           { c1:'#B84A6A', c2:'#D47A8A', c3:'#E8B0B8', sx:200, sy:145, glass:'wine'    },
  'wines':             { c1:'#8A4A8A', c2:'#A86AA8', c3:'#C8A0C8', sx:200, sy:145, glass:'wine'    },
  'tequila':           { c1:'#C4A03A', c2:'#D4B868', c3:'#E8D898', sx:88,  sy:230, glass:'shot'    },
  'bourbon':           { c1:'#9A4A28', c2:'#C07048', c3:'#D4A878', sx:88,  sy:235, glass:'rocks'   },
  'rye-whiskey':       { c1:'#7A5038', c2:'#A07858', c3:'#C4A878', sx:88,  sy:235, glass:'rocks'   },
}
const defaultPalette = { c1:'#C4A87A', c2:'#D4B890', c3:'#E8D4B0', sx:200, sy:230, glass:'rocks' }

const palette  = computed(() => palettes[props.category] ?? defaultPalette)
const glass    = computed(() => palette.value.glass)
const filterSeed = computed(() => {
  let h = 0
  for (const ch of String(props.uid)) h = (h * 31 + ch.charCodeAt(0)) & 0xff
  return h % 20
})

// 6 label positions alternating left / right
// Kept well inside 0-300 viewBox so text never clips at card edges
const labelPos = [
  { tx:116, lx1:120, lx2:132, ly:112, anchor:'end'   },
  { tx:184, lx1:168, lx2:180, ly:133, anchor:'start' },
  { tx:113, lx1:117, lx2:129, ly:182, anchor:'end'   },
  { tx:187, lx1:171, lx2:183, ly:205, anchor:'start' },
  { tx:116, lx1:120, lx2:132, ly:258, anchor:'end'   },
  { tx:184, lx1:168, lx2:180, ly:278, anchor:'start' },
]

const displayLabels = computed(() =>
  props.ingredients
    .slice(0, 6)
    .map(ing =>
      // Strip quantities then take first meaningful word
      ing
        .replace(/\d+(\.\d+)?\s*(ml|oz|cl|dashes?|drops?|cube|peel|sprig|tsp|tbsp|barspoon|piece|g)\b/gi, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 1)
        .join(' ')
    )
)
</script>
