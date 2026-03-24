import { 
  GraduationCapIcon, 
  Home, 
  Info, 
  StickyNote, 
  University, 
  BookCheck,
  UserPen,
  NotebookTabs,
  BookUser,
  CalendarDays
} from 'lucide-react'

export type NavItemConfig =
  | {
    type: 'item'
    label: string
    to: string
    icon: any
  }
  | {
    type: 'group'
    label: string
    icon: any
    key: string
    children: Array<{
      label: string
      to: string
      icon: any
    }>
  }

export const navigationConfig: Array<NavItemConfig> = [
  {
    type: 'item',
    label: 'Home',
    to: '/dashboard',
    icon: Home,
  },
  {
    type: 'item',
    label: 'About',
    to: '/about',
    icon: Info,
  },
  {
    type: 'item',
    label: 'HEI General Information',
    to: '/heiinfo',
    icon: University,
  },
  {
    type: 'item',
    label: 'Program Information',
    to: '/programinfo-submissions',
    icon: BookCheck, 
  },
  {
    type: 'item',
    label: 'Student Profile',
    to: '/studentprofile',
    icon: GraduationCapIcon,
  },
  {
    type: 'item',
    label: 'Law Faculty Profile',
    to: '/facultyprofile',
    icon: UserPen,
  },
  {
    type: 'item',
    label: 'Faculty Developement Activity',
    to: '/facultydevelopment',
    icon: NotebookTabs,
  },
  {
    type: 'item',
    label: 'Faculty Roster',
    to: '/facultyroster',
    icon: BookUser,
  },
  {
    type: 'item',
    label: 'Class Schedule',
    to: '/schedule',
    icon: CalendarDays,
  },
  {
    type: 'group',
    label: 'Start - SSR Demos',
    icon: StickyNote,
    key: 'StartSSRDemo',
    children: [
      {
        label: 'SPA Mode',
        to: '/demo/start/ssr/spa-mode',
        icon: StickyNote,
      },
      {
        label: 'Full SSR',
        to: '/demo/start/ssr/full-ssr',
        icon: StickyNote,
      },
      {
        label: 'Data Only',
        to: '/demo/start/ssr/data-only',
        icon: StickyNote,
      },
    ],
  },
]
