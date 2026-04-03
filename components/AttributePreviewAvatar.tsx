'use client'
import * as React from 'react'
import type { Attributes } from '@/lib/types'

const CX = 100

// ─── Colors ───────────────────────────────────────────────────────────────────
const SKIN_HEX: Record<string, string> = {
  porcelain: '#FFE8D6', ivory: '#FADFCA', fair: '#F5CEB0',
  light_beige: '#EABB96', peach: '#E2A478', medium: '#C47850',
  olive: '#A86A38', tan: '#8E5A2E', caramel: '#784220',
  brown: '#623210', mahogany: '#481E0C', dark: '#300E06', ebony: '#1C0802',
}
const HAIR_HEX: Record<string, string> = {
  black: '#2A2018', brown: '#5C3010', blonde: '#C8A030', red: '#982020',
  auburn: '#6E2000', gray: '#868686', white: '#DEDEDE', colored: '#6020A8',
  green: '#186020', pink: '#D82E60', purple: '#581080',
}
// Slightly lighter shade for hair sheen/outline
const HAIR_LIGHT: Record<string, string> = {
  black: '#4A3C2C', brown: '#8A5828', blonde: '#E8C860', red: '#C04040',
  auburn: '#904020', gray: '#ABABAB', white: '#F4F4F4', colored: '#9040D8',
  green: '#2E9040', pink: '#F050A0', purple: '#8830C0',
}
const EYE_HEX: Record<string, string> = {
  brown: '#6B3A10', dark_brown: '#2E1004', hazel: '#7A5B10', green: '#285820',
  blue: '#245094', gray: '#506070', amber: '#A05008', black: '#1A1A1A',
}

// ─── Y levels (viewBox 200 x 510) ────────────────────────────────────────────
const SY   = 122
const BUY  = 168
const UBY  = 194
const WY   = 238
const HY   = 284
const CY   = 322
const KY   = 412
const ANKY = 490

// Head
const HCY = 58   // head center Y
const HRX = 36   // default head rx
const HRY = 42   // default head ry
// Hairline Y — bottom edge of the hair cap. Must leave forehead visible.
// Head top ≈ 16, brows ≈ 41. Hairline at ≈ 26 gives ~15px of forehead.
const HAIRLINE_Y = HCY - HRY * 0.76   // ≈ 26

// ─── Face shape → head dimensions ─────────────────────────────────────────────
// rx/ry are ALWAYS set — used for hair calculations and neck width
// path is optional — used for the visible face outline only
interface HeadDim { rx: number; ry: number; path?: string }

function getHeadDim(shape?: string): HeadDim {
  switch (shape) {
    case 'round':   return { rx: 42, ry: 42 }
    case 'square':  return { rx: 40, ry: 38 }
    case 'heart':   return { rx: 38, ry: 44, path: heartFacePath() }
    case 'diamond': return { rx: 38, ry: 44, path: diamondFacePath() }
    case 'oblong':  return { rx: 30, ry: 50 }
    default:        return { rx: 36, ry: 42 } // oval
  }
}

function heartFacePath(): string {
  const cx = CX, top = HCY - 44, bot = HCY + 46
  return `M ${cx},${bot}
    C ${cx-18},${HCY+20} ${cx-44},${HCY} ${cx-40},${HCY-20}
    C ${cx-36},${HCY-44} ${cx-16},${top} ${cx},${top+8}
    C ${cx+16},${top} ${cx+36},${HCY-44} ${cx+40},${HCY-20}
    C ${cx+44},${HCY} ${cx+18},${HCY+20} ${cx},${bot} Z`
}

function diamondFacePath(): string {
  const cx = CX, top = HCY - 44, bot = HCY + 44
  return `M ${cx},${top}
    C ${cx+18},${top+14} ${cx+42},${HCY-10} ${cx+40},${HCY}
    C ${cx+42},${HCY+10} ${cx+18},${HCY+30} ${cx},${bot}
    C ${cx-18},${HCY+30} ${cx-42},${HCY+10} ${cx-40},${HCY}
    C ${cx-42},${HCY-10} ${cx-18},${top+14} ${cx},${top} Z`
}

// ─── Body measurements ────────────────────────────────────────────────────────
const BUST_MAP:  Record<string, number> = { petite:20, small:24, medium:30, large:38, very_large:46 }
const WAIST_MAP: Record<string, number> = { very_narrow:15, narrow:19, average:24, wide:32 }
const HIP_MAP:   Record<string, number> = { narrow:23, average:29, wide:37, very_wide:46 }
const BUTT_MAP:  Record<string, number> = { flat:-3, average:0, round:4, bubble:9, large_bubble:15 }
const THIGH_MAP: Record<string, number> = { slim:11, average:15, thick:21, very_thick:27 }

type M6 = [number,number,number,number,number,number]
const BODY_BASE: Record<string, M6> = {
  slim:           [25, 22, 20, 17, 23, 11],
  petite:         [23, 20, 18, 16, 21, 10],
  lean_athletic:  [29, 24, 22, 19, 25, 13],
  athletic:       [32, 26, 24, 22, 29, 15],
  rectangle:      [28, 26, 25, 25, 27, 15],
  curvy:          [27, 30, 26, 18, 36, 21],
  hourglass:      [29, 32, 26, 15, 35, 20],
  full_hourglass: [31, 39, 31, 15, 44, 27],
  pear:           [23, 24, 21, 19, 40, 26],
  busty:          [29, 42, 33, 20, 33, 18],
  apple:          [31, 35, 33, 31, 32, 18],
  thick:          [30, 31, 28, 27, 38, 24],
  plus_size:      [35, 40, 36, 34, 44, 29],
  muscular:       [35, 27, 25, 23, 30, 19],
  average:        [26, 24, 22, 22, 27, 14],
  'hour glass':   [29, 32, 26, 15, 35, 20],
}

interface Measure { sw:number; bw:number; ubw:number; ww:number; hw:number; tw:number }

function getMeasure(a: Attributes): Measure {
  const [sw, bw0,,ww0, hw0, tw0] = BODY_BASE[a.body_type || 'slim'] ?? BODY_BASE.slim
  const bw  = a.bust_size   ? BUST_MAP[a.bust_size]    ?? bw0  : bw0
  const ww  = a.waist_shape ? WAIST_MAP[a.waist_shape] ?? ww0  : ww0
  const hw  = (a.hip_width  ? HIP_MAP[a.hip_width]     ?? hw0  : hw0)
            + (BUTT_MAP[a.butt_shape || ''] ?? 0)
  const tw  = a.thigh_shape ? THIGH_MAP[a.thigh_shape] ?? tw0  : tw0
  return { sw, bw, ubw: bw * 0.82, ww, hw, tw }
}

function makeBodyPath({ sw,bw,ubw,ww,hw,tw }: Measure): string {
  const g = 5
  const l = (x:number) => CX - x, r = (x:number) => CX + x
  return [
    `M ${l(sw)},${SY}`,
    `C ${l(sw)},${SY+16} ${l(bw)},${BUY-26} ${l(bw)},${BUY}`,
    `C ${l(bw)},${BUY+12} ${l(ubw)},${UBY-8} ${l(ubw)},${UBY}`,
    `C ${l(ubw)},${UBY+24} ${l(ww)},${WY-20} ${l(ww)},${WY}`,
    `C ${l(ww)},${WY+22} ${l(hw)},${HY-20} ${l(hw)},${HY}`,
    `C ${l(hw)},${HY+22} ${l(tw+g)},${CY-12} ${l(tw+g)},${CY}`,
    `L ${l(tw-3)},${CY} L ${l(tw-5)},${KY} L ${l(tw-7)},${ANKY}`,
    `L ${l(g-3)},${ANKY} L ${l(g-3)},${KY} L ${l(g-3)},${CY+10}`,
    `Q ${CX},${CY+18} ${r(g-3)},${CY+10}`,
    `L ${r(g-3)},${KY} L ${r(g-3)},${ANKY}`,
    `L ${r(tw-7)},${ANKY} L ${r(tw-5)},${KY} L ${r(tw-3)},${CY}`,
    `C ${r(tw+g)},${CY-12} ${r(hw)},${HY+22} ${r(hw)},${HY}`,
    `C ${r(hw)},${HY-20} ${r(ww)},${WY+22} ${r(ww)},${WY}`,
    `C ${r(ww)},${WY-20} ${r(ubw)},${UBY+24} ${r(ubw)},${UBY}`,
    `C ${r(ubw)},${UBY-8} ${r(bw)},${BUY+12} ${r(bw)},${BUY}`,
    `C ${r(bw)},${BUY-26} ${r(sw)},${SY+16} ${r(sw)},${SY} Z`,
  ].join(' ')
}

function makeArmPath({ sw }: Measure): string {
  const lo = CX-sw-3, ro = CX+sw+3, aw = 9
  return [
    `M ${lo},${SY+10} C ${lo-4},${SY+28} ${lo-13},${WY-14} ${lo-15},${WY+20}`,
    `C ${lo-15},${WY+28} ${lo-15+aw},${WY+28} ${lo-15+aw},${WY+20}`,
    `C ${lo-13+aw},${WY-14} ${lo-4+aw},${SY+28} ${lo+aw},${SY+10} Z`,
    `M ${ro},${SY+10} C ${ro+4},${SY+28} ${ro+13},${WY-14} ${ro+15},${WY+20}`,
    `C ${ro+15},${WY+28} ${ro+15-aw},${WY+28} ${ro+15-aw},${WY+20}`,
    `C ${ro+13-aw},${WY-14} ${ro+4-aw},${SY+28} ${ro-aw},${SY+10} Z`,
  ].join(' ')
}

function BodyDetail({ m }: { m: Measure }) {
  const { bw,ww,hw,tw } = m
  const sh = 'rgba(0,0,0,0.10)', hi = 'rgba(255,255,255,0.20)'
  const br = bw * 0.44
  return (
    <g>
      <line x1={CX} y1={SY+8} x2={CX} y2={WY+6} stroke={sh} strokeWidth={0.8} />
      <path d={`M ${CX-bw+4},${SY+5} Q ${CX},${SY-2} ${CX+bw-4},${SY+5}`} stroke={sh} strokeWidth={1.1} fill="none" />
      <path d={`M ${CX-bw+3},${BUY+5} A ${br} ${br} 0 0 0 ${CX-3},${BUY+17}`} stroke={sh} strokeWidth={1.4} fill="none" />
      <path d={`M ${CX+3},${BUY+17} A ${br} ${br} 0 0 0 ${CX+bw-3},${BUY+5}`} stroke={sh} strokeWidth={1.4} fill="none" />
      <ellipse cx={CX-bw*0.42} cy={BUY-12} rx={br*0.44} ry={br*0.28} fill={hi} transform={`rotate(-14,${CX-bw*0.42},${BUY-12})`} />
      <ellipse cx={CX+bw*0.42} cy={BUY-12} rx={br*0.44} ry={br*0.28} fill={hi} transform={`rotate(14,${CX+bw*0.42},${BUY-12})`} />
      <line x1={CX-ww-2} y1={WY-10} x2={CX-ww-2} y2={WY+10} stroke={hi} strokeWidth={1.6} />
      <line x1={CX+ww+2} y1={WY-10} x2={CX+ww+2} y2={WY+10} stroke={hi} strokeWidth={1.6} />
      <ellipse cx={CX} cy={WY-6} rx={2.4} ry={3} fill={sh} />
      <path d={`M ${CX-hw+3},${HY-16} Q ${CX-hw-5},${HY} ${CX-hw+3},${HY+16}`} stroke={hi} strokeWidth={1.5} fill="none" />
      <path d={`M ${CX+hw-3},${HY-16} Q ${CX+hw+5},${HY} ${CX+hw-3},${HY+16}`} stroke={hi} strokeWidth={1.5} fill="none" />
      <line x1={CX-tw+8} y1={CY+12} x2={CX-tw+10} y2={KY-10} stroke={sh} strokeWidth={1.3} />
      <line x1={CX+tw-8} y1={CY+12} x2={CX+tw-10} y2={KY-10} stroke={sh} strokeWidth={1.3} />
      <ellipse cx={CX-tw+9} cy={KY+2} rx={6} ry={4.5} fill={sh} opacity={0.45} />
      <ellipse cx={CX+tw-9} cy={KY+2} rx={6} ry={4.5} fill={sh} opacity={0.45} />
    </g>
  )
}

// ─── Hair paths ───────────────────────────────────────────────────────────────
// KEY RULE: hair cap (front top) must never go below HAIRLINE_Y (≈36)
// so it sits on top of the head and never covers face/eyes

const HANG_Y: Record<string, number> = { buzz:0, short:30, medium:95, long:180, very_long:300 }

interface HairPaths { back: string | null; front: string | null }

// Top cap that sits on head only — shared by most styles
function topCap(hrx: number, hry: number): string {
  const htop = HCY - hry + 2
  return `M ${CX-hrx-4},${HAIRLINE_Y}
    Q ${CX-hrx-2},${htop+4} ${CX-hrx+4},${htop+1}
    Q ${CX},${htop-7} ${CX+hrx-4},${htop+1}
    Q ${CX+hrx+2},${htop+4} ${CX+hrx+4},${HAIRLINE_Y}
    Q ${CX},${HAIRLINE_Y} ${CX-hrx-4},${HAIRLINE_Y} Z`
}

function buildHair(style?: string, length?: string, hdim?: HeadDim): HairPaths {
  if (!style || style === 'bald') return { back: null, front: null }

  const hrx = hdim?.rx ?? HRX
  const hry = hdim?.ry ?? HRY
  const hang  = HANG_Y[length || 'medium'] ?? 95
  const endY  = Math.min(HCY + hry + hang, ANKY - 10)
  const htop  = HCY - hry + 2

  if (style === 'buzz' || length === 'buzz') return {
    back: null,
    front: `M ${CX-hrx+2},${HCY}
      A ${hrx+4} ${hry+4} 0 1 1 ${CX+hrx-2},${HCY}
      Q ${CX+hrx+2},${HCY+12} ${CX},${HCY+hry+4}
      Q ${CX-hrx-2},${HCY+12} ${CX-hrx+2},${HCY} Z`,
  }

  if (style === 'afro' || style === 'coily') {
    // Afro sits above + around the head. Bottom edge = HAIRLINE_Y so face stays fully visible.
    // Width scales with length; height stays proportional but clamps to viewbox top.
    const sc   = length === 'very_long' ? 1.55 : length === 'long' ? 1.35 : length === 'short' ? 0.88 : 1.12
    const rx2  = hrx * sc * 1.48
    const topY = Math.max(4, HCY - hry - rx2 * 0.88)  // never above y=4
    return {
      back: null,
      // Arc from left-ear to right-ear level (HAIRLINE_Y), bulging up and outward
      front: `M ${CX-rx2},${HAIRLINE_Y}
        A ${rx2} ${HAIRLINE_Y - topY} 0 1 1 ${CX+rx2},${HAIRLINE_Y}
        Q ${CX},${HAIRLINE_Y+4} ${CX-rx2},${HAIRLINE_Y} Z`,
    }
  }

  if (style === 'pixie') return {
    back: null,
    front: `M ${CX-hrx-6},${HAIRLINE_Y}
      Q ${CX-hrx-8},${HAIRLINE_Y-4} ${CX-hrx+2},${htop+2}
      Q ${CX},${htop-8} ${CX+hrx-2},${htop+2}
      Q ${CX+hrx+8},${HAIRLINE_Y-4} ${CX+hrx+6},${HAIRLINE_Y}
      Q ${CX+hrx+10},${HCY+4} ${CX+hrx+2},${HCY+hry-4}
      Q ${CX},${HCY+hry+4} ${CX-hrx-2},${HCY+hry-4}
      Q ${CX-hrx-10},${HCY+4} ${CX-hrx-6},${HAIRLINE_Y} Z`,
  }

  if (style === 'bob') {
    const bobY = HCY + hry + 30
    return {
      back: `M ${CX-hrx-4},${HAIRLINE_Y} Q ${CX-hrx-12},${HCY+30} ${CX-hrx-10},${bobY}
             L ${CX+hrx+10},${bobY} Q ${CX+hrx+12},${HCY+30} ${CX+hrx+4},${HAIRLINE_Y} Z`,
      front: topCap(hrx,hry) + `
        M ${CX-hrx-6},${HAIRLINE_Y} Q ${CX-hrx-12},${HCY+22} ${CX-hrx-10},${bobY}
        L ${CX-hrx+6},${bobY} Q ${CX-hrx+2},${HCY+22} ${CX-hrx+2},${HAIRLINE_Y} Z
        M ${CX+hrx+6},${HAIRLINE_Y} Q ${CX+hrx+12},${HCY+22} ${CX+hrx+10},${bobY}
        L ${CX+hrx-6},${bobY} Q ${CX+hrx-2},${HCY+22} ${CX+hrx-2},${HAIRLINE_Y} Z`,
    }
  }

  if (style === 'bun') return {
    back: null,
    front: topCap(hrx,hry) + `
      M ${CX-17},${htop-2} A 19 16 0 1 1 ${CX+17},${htop-2} A 19 16 0 1 1 ${CX-17},${htop-2} Z`,
  }

  if (style === 'updo') return {
    back: null,
    front: topCap(hrx,hry) + `
      M ${CX-20},${htop+2} Q ${CX-10},${htop-22} ${CX+10},${htop-22}
      Q ${CX+20},${htop+2} ${CX+12},${htop+14}
      Q ${CX},${htop+20} ${CX-12},${htop+14}
      Q ${CX-20},${htop+2} ${CX-20},${htop+2} Z`,
  }

  if (style === 'ponytail') return {
    back: `M ${CX+8},${HAIRLINE_Y}
      C ${CX+hrx+20},${HCY+40} ${CX+hrx+14},${HCY+hry+hang*0.5} ${CX+hrx+6},${endY}
      L ${CX+hrx-6},${endY}
      C ${CX+hrx+2},${HCY+hry+hang*0.5} ${CX+hrx+8},${HCY+40} ${CX+16},${HAIRLINE_Y} Z`,
    front: topCap(hrx,hry),
  }

  if (style === 'half_up') {
    const sw2 = 16
    return {
      back: `M ${CX-hrx+2},${HAIRLINE_Y}
        C ${CX-hrx-sw2},${HCY+50} ${CX-hrx-sw2-4},${endY-30} ${CX-hrx-sw2+2},${endY}
        L ${CX+hrx+sw2-2},${endY}
        C ${CX+hrx+sw2+4},${endY-30} ${CX+hrx+sw2},${HCY+50} ${CX+hrx-2},${HAIRLINE_Y} Z`,
      front: topCap(hrx,hry) + `
        M ${CX-17},${HAIRLINE_Y+2} Q ${CX},${HAIRLINE_Y-14} ${CX+17},${HAIRLINE_Y+2}
        Q ${CX+20},${HAIRLINE_Y} ${CX+14},${HAIRLINE_Y+14}
        Q ${CX},${HAIRLINE_Y+18} ${CX-14},${HAIRLINE_Y+14}
        Q ${CX-20},${HAIRLINE_Y} ${CX-17},${HAIRLINE_Y+2} Z`,
    }
  }

  if (style === 'braid') return {
    back: `M ${CX-10},${HCY+hry-4}
      C ${CX-12},${HCY+hry+40} ${CX-10},${endY-20} ${CX-8},${endY}
      L ${CX+8},${endY}
      C ${CX+10},${endY-20} ${CX+12},${HCY+hry+40} ${CX+10},${HCY+hry-4} Z`,
    front: topCap(hrx,hry),
  }

  if (style === 'box_braids') {
    const offsets = [-27, -11, 7, 23]
    const braids = offsets.map(ox =>
      `M ${CX+ox},${HCY+hry-2} L ${CX+ox},${endY} L ${CX+ox+11},${endY} L ${CX+ox+11},${HCY+hry-2} Z`
    ).join(' ')
    return { back: braids, front: topCap(hrx,hry) }
  }

  // Flowing: straight / wavy / curly
  const spread = style === 'curly' ? 28 : style === 'wavy' ? 20 : 13
  const wave   = style === 'wavy'  ? 7  : style === 'curly' ? 12 : 0
  const curl   = style === 'curly'

  const back = `M ${CX-hrx+2},${HAIRLINE_Y}
    C ${CX-hrx-spread+wave},${HCY+50} ${CX-hrx-spread-wave},${curl?HCY+120:endY*0.5} ${CX-hrx-spread+wave},${curl?HCY+165:endY*0.75}
    C ${CX-hrx-spread-wave},${curl?HCY+200:endY*0.88} ${CX-hrx-spread},${endY-20} ${CX-hrx-4},${endY}
    L ${CX+hrx+4},${endY}
    C ${CX+hrx+spread},${endY-20} ${CX+hrx+spread+wave},${curl?HCY+200:endY*0.88} ${CX+hrx+spread-wave},${curl?HCY+165:endY*0.75}
    C ${CX+hrx+spread+wave},${curl?HCY+120:endY*0.5} ${CX+hrx+spread-wave},${HCY+50} ${CX+hrx-2},${HAIRLINE_Y} Z`

  // Side curtains — stop at shoulder at most, don't cover face
  const curtainEnd = Math.min(endY, HCY + hry + 50)
  const curtainFront = `
    M ${CX-hrx-4},${HAIRLINE_Y}
    Q ${CX-hrx-spread*0.5},${HCY+42} ${CX-hrx-spread*0.28},${curtainEnd}
    L ${CX-hrx-spread*0.28+14},${curtainEnd}
    Q ${CX-hrx+2},${HCY+42} ${CX-hrx+4},${HAIRLINE_Y} Z
    M ${CX+hrx+4},${HAIRLINE_Y}
    Q ${CX+hrx+spread*0.5},${HCY+42} ${CX+hrx+spread*0.28},${curtainEnd}
    L ${CX+hrx+spread*0.28-14},${curtainEnd}
    Q ${CX+hrx-2},${HCY+42} ${CX+hrx-4},${HAIRLINE_Y} Z`

  return { back, front: topCap(hrx,hry) + curtainFront }
}

// ─── Face ─────────────────────────────────────────────────────────────────────
function Face({ attrs }: { attrs: Attributes }) {
  const eyeCol = EYE_HEX[attrs.eye_color || ''] || '#5A3010'
  const makeup = attrs.eye_makeup
  const lips   = attrs.lips_fullness
  const sh     = 'rgba(0,0,0,0.12)'
  const cy     = HCY

  const lashW  = (makeup === 'bold_lashes' || makeup === 'glam') ? 2.6 : 1.8
  const liner  = makeup && makeup !== 'no_makeup'
  const catWng = makeup === 'cat_eye' || makeup === 'glam'
  const smoky  = makeup === 'smoky' || makeup === 'glam'

  // Lips are INDEPENDENT of eye makeup — always natural pink-red
  const lipH   = lips === 'full' ? 5.5 : lips === 'thin' ? 2.2 : 4
  const lipW   = lips === 'full' ? 10  : lips === 'thin' ? 7   : 8.5
  const lipCol = 'rgba(195,85,95,0.65)'

  return (
    <g>
      {/* Nose */}
      <path d={`M ${CX-2.5},${cy+6} Q ${CX},${cy+14} ${CX+2.5},${cy+6}`}
        stroke={sh} strokeWidth={1} fill="none" strokeLinecap="round" />
      <ellipse cx={CX-4} cy={cy+15} rx={2.8} ry={1.8} fill={sh} opacity={0.4} />
      <ellipse cx={CX+4} cy={cy+15} rx={2.8} ry={1.8} fill={sh} opacity={0.4} />

      {/* Lower lip */}
      <path d={`M ${CX-lipW},${cy+22}
        Q ${CX-lipW*0.3},${cy+22+lipH*1.2} ${CX},${cy+22+lipH*1.35}
        Q ${CX+lipW*0.3},${cy+22+lipH*1.2} ${CX+lipW},${cy+22}
        Q ${CX},${cy+24} ${CX-lipW},${cy+22} Z`}
        fill={lipCol} />
      {/* Upper lip cupid bow */}
      <path d={`M ${CX-lipW},${cy+22}
        Q ${CX-lipW*0.55},${cy+19} ${CX-2.5},${cy+20.5}
        Q ${CX},${cy+18} ${CX+2.5},${cy+20.5}
        Q ${CX+lipW*0.55},${cy+19} ${CX+lipW},${cy+22}
        Q ${CX},${cy+23.5} ${CX-lipW},${cy+22} Z`}
        fill={lipCol} />
      {/* Lip shine */}
      <ellipse cx={CX-3} cy={cy+20.5} rx={3} ry={1.2} fill="rgba(255,255,255,0.18)" />

      {/* Brows */}
      <path d={`M ${CX-17},${cy-17} Q ${CX-9},${cy-24} ${CX-1},${cy-18}`}
        stroke="rgba(0,0,0,0.46)" strokeWidth={2.3} fill="none" strokeLinecap="round" />
      <path d={`M ${CX+1},${cy-18} Q ${CX+9},${cy-24} ${CX+17},${cy-17}`}
        stroke="rgba(0,0,0,0.46)" strokeWidth={2.3} fill="none" strokeLinecap="round" />

      {/* Smoky shadow */}
      {smoky && <>
        <ellipse cx={CX-9} cy={cy-9} rx={10.5} ry={6.5} fill="rgba(40,20,60,0.22)" />
        <ellipse cx={CX+9} cy={cy-9} rx={10.5} ry={6.5} fill="rgba(40,20,60,0.22)" />
      </>}

      {/* Eye whites */}
      <ellipse cx={CX-9} cy={cy-9} rx={7.8} ry={5.5} fill="rgba(255,255,255,0.93)" />
      <ellipse cx={CX+9} cy={cy-9} rx={7.8} ry={5.5} fill="rgba(255,255,255,0.93)" />
      {/* Iris */}
      <circle cx={CX-9} cy={cy-9} r={4.2}   fill={eyeCol} />
      <circle cx={CX+9} cy={cy-9} r={4.2}   fill={eyeCol} />
      {/* Pupil */}
      <circle cx={CX-9} cy={cy-9} r={2}     fill="rgba(0,0,0,0.90)" />
      <circle cx={CX+9} cy={cy-9} r={2}     fill="rgba(0,0,0,0.90)" />
      {/* Iris ring */}
      <circle cx={CX-9} cy={cy-9} r={4.2}   fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth={0.6} />
      <circle cx={CX+9} cy={cy-9} r={4.2}   fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth={0.6} />
      {/* Shine */}
      <circle cx={CX-7.2} cy={cy-11.5} r={1.6} fill="rgba(255,255,255,0.82)" />
      <circle cx={CX+10.8} cy={cy-11.5} r={1.6} fill="rgba(255,255,255,0.82)" />

      {/* Upper lash arc */}
      <path d={`M ${CX-17},${cy-9} Q ${CX-9},${cy-16} ${CX-1},${cy-9}`}
        stroke="rgba(0,0,0,0.82)" strokeWidth={lashW} fill="none" strokeLinecap="round" />
      <path d={`M ${CX+1},${cy-9} Q ${CX+9},${cy-16} ${CX+17},${cy-9}`}
        stroke="rgba(0,0,0,0.82)" strokeWidth={lashW} fill="none" strokeLinecap="round" />
      {liner && <>
        <path d={`M ${CX-17},${cy-9} Q ${CX-9},${cy-15} ${CX-1},${cy-9}`}
          stroke="rgba(0,0,0,0.95)" strokeWidth={1.2} fill="none" strokeLinecap="round" />
        <path d={`M ${CX+1},${cy-9} Q ${CX+9},${cy-15} ${CX+17},${cy-9}`}
          stroke="rgba(0,0,0,0.95)" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </>}
      {catWng && <>
        <path d={`M ${CX-17},${cy-9} L ${CX-22},${cy-15}`}
          stroke="rgba(0,0,0,0.90)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d={`M ${CX+17},${cy-9} L ${CX+22},${cy-15}`}
          stroke="rgba(0,0,0,0.90)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </>}
      {/* Lower lash */}
      <path d={`M ${CX-17},${cy-8} Q ${CX-9},${cy-4} ${CX-1},${cy-8}`}
        stroke="rgba(0,0,0,0.22)" strokeWidth={0.9} fill="none" />
      <path d={`M ${CX+1},${cy-8} Q ${CX+9},${cy-4} ${CX+17},${cy-8}`}
        stroke="rgba(0,0,0,0.22)" strokeWidth={0.9} fill="none" />

      {/* Blush */}
      <ellipse cx={CX-26} cy={cy+8} rx={11} ry={6.5} fill="rgba(215,95,95,0.09)" />
      <ellipse cx={CX+26} cy={cy+8} rx={11} ry={6.5} fill="rgba(215,95,95,0.09)" />
    </g>
  )
}

// ─── Head shape ───────────────────────────────────────────────────────────────
function HeadShape({ hdim, skin }: { hdim: HeadDim; skin: string }) {
  if (hdim.path) {
    return <>
      <path d={hdim.path} fill={skin} />
      <path d={hdim.path} fill="url(#hdG)" />
    </>
  }
  return <>
    <ellipse cx={CX} cy={HCY} rx={hdim.rx} ry={hdim.ry} fill={skin} />
    <ellipse cx={CX} cy={HCY} rx={hdim.rx} ry={hdim.ry} fill="url(#hdG)" />
  </>
}

function HeadClipPath({ hdim }: { hdim: HeadDim }) {
  if (hdim.path) return <clipPath id="avHC"><path d={hdim.path} /></clipPath>
  return <clipPath id="avHC"><ellipse cx={CX} cy={HCY} rx={hdim.rx+2} ry={hdim.ry+2} /></clipPath>
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AttributePreviewAvatar({ attrs }: { attrs: Attributes }) {
  const m        = getMeasure(attrs)
  const skin     = SKIN_HEX[attrs.skin_tone || ''] || '#C8A882'
  const hair     = HAIR_HEX[attrs.hair_color || ''] || '#5C3010'
  const hairLit  = HAIR_LIGHT[attrs.hair_color || ''] || '#8A5828'
  const hdim     = getHeadDim(attrs.face_shape)
  const bodyPath = makeBodyPath(m)
  const armPath  = makeArmPath(m)
  const { back: hairBack, front: hairFront } = buildHair(attrs.hair_style, attrs.hair_length, hdim)

  // Neck width based on face shape
  const nw = hdim.rx ? Math.round(hdim.rx * 0.24) : 9

  return (
    <svg viewBox="0 0 200 510" className="w-full" style={{ maxHeight: 440 }} aria-hidden>
      <defs>
        <linearGradient id="avH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.22)" />
          <stop offset="22%"  stopColor="rgba(0,0,0,0.05)" />
          <stop offset="50%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="78%"  stopColor="rgba(0,0,0,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>
        <linearGradient id="avV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.13)" />
        </linearGradient>
        <linearGradient id="hdG" x1="0.3" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.11)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
        </linearGradient>
        <clipPath id="avBC"><path d={bodyPath} /></clipPath>
        <HeadClipPath hdim={hdim} />
      </defs>

      {/* Back hair — behind everything */}
      {hairBack && (
        <path d={hairBack} fill={hair}
          stroke={hairLit} strokeWidth={attrs.hair_color === 'black' ? 1.2 : 0.6} strokeOpacity={0.35} />
      )}

      {/* Arms */}
      <path d={armPath} fill={skin} />
      <path d={armPath} fill="url(#avH)" opacity={0.7} />

      {/* Body */}
      <path d={bodyPath} fill={skin} />
      <g clipPath="url(#avBC)">
        <BodyDetail m={m} />
        <path d={bodyPath} fill="url(#avH)" />
        <path d={bodyPath} fill="url(#avV)" />
      </g>

      {/* Neck */}
      <path
        d={`M ${CX-nw},${HCY+(hdim.ry??HRY)-3}
            C ${CX-nw},${HCY+(hdim.ry??HRY)+8} ${CX-nw+1},${SY-2} ${CX-nw+1},${SY}
            L ${CX+nw-1},${SY}
            C ${CX+nw-1},${SY-2} ${CX+nw},${HCY+(hdim.ry??HRY)+8} ${CX+nw},${HCY+(hdim.ry??HRY)-3} Z`}
        fill={skin}
      />

      {/* Head */}
      <HeadShape hdim={hdim} skin={skin} />

      {/* Front hair — on top of head, but face drawn after so face always visible */}
      {hairFront && (
        <path d={hairFront} fill={hair}
          stroke={hairLit} strokeWidth={attrs.hair_color === 'black' ? 1.0 : 0.5} strokeOpacity={0.30} />
      )}

      {/* Face — always on top of hair */}
      <Face attrs={attrs} />
    </svg>
  )
}
