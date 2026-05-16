import type { GraphNode } from '@/types/graph.types'

export interface GraphEdge {
  from: string
  to: string
  warm?: boolean
  weight?: number
  edgeType?: 'worked_at' | 'studied_at' | 'knows' | 'has_skill' | 'member_of'
}

export interface MockGraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export const mockGraphData: MockGraphData = {
  nodes: [
    { id: 'user',     name: 'Ahmad Kamal',   kind: 'user',      sub: 'CS Grad · UM', val: 16 },

    { id: 'co-google', name: 'Google',  kind: 'company', val: 14 },
    { id: 'co-stripe', name: 'Stripe',  kind: 'company', val: 14 },
    { id: 'co-grab',   name: 'Grab',    kind: 'company', val: 14 },
    { id: 'co-shopee', name: 'Shopee',  kind: 'company', val: 14 },
    { id: 'co-airbnb', name: 'Airbnb',  kind: 'company', val: 14 },

    { id: 'p-1',  name: 'James Tan',    kind: 'person', sub: 'SWE · Google',       university: 'UM',   company: 'co-google', warmness: 82, val: 9 },
    { id: 'p-2',  name: 'Priya Sharma', kind: 'person', sub: 'ML Eng · Google',    university: 'UM',   company: 'co-google', warmness: 78, val: 9 },
    { id: 'p-3',  name: 'Wei Lin',      kind: 'person', sub: 'PM · Grab',          university: 'UM',   company: 'co-grab',   warmness: 71, val: 9 },
    { id: 'p-4',  name: 'Sarah Lim',    kind: 'person', sub: 'Recruiter · Stripe', university: 'NUS',  company: 'co-stripe', warmness: 65, val: 9 },
    { id: 'p-5',  name: 'Raj Kumar',    kind: 'person', sub: 'Backend · Stripe',   university: 'NTU',  company: 'co-stripe', warmness: 58, val: 9 },
    { id: 'p-6',  name: 'Aisha Malik',  kind: 'person', sub: 'Frontend · Shopee',  university: 'UM',   company: 'co-shopee', warmness: 74, val: 9 },
    { id: 'p-7',  name: 'David Chen',   kind: 'person', sub: 'Data Eng · Airbnb',  university: 'UTAR', company: 'co-airbnb', warmness: 45, val: 9 },
    { id: 'p-8',  name: 'Nurul Ain',    kind: 'person', sub: 'SWE · Google',       university: 'UTM',  company: 'co-google', warmness: 60, val: 9 },
    { id: 'p-9',  name: 'Kevin Foo',    kind: 'person', sub: 'DevOps · Grab',      university: 'UM',   company: 'co-grab',   warmness: 69, val: 9 },
    { id: 'p-10', name: 'Mei Ling',     kind: 'person', sub: 'PM · Shopee',        university: 'UM',   company: 'co-shopee', warmness: 76, val: 9 },
    { id: 'p-11', name: 'Arif Haziq',   kind: 'person', sub: 'SWE · Stripe',       university: 'UM',   company: 'co-stripe', warmness: 80, val: 9 },
    { id: 'p-12', name: 'Lin Feng',     kind: 'person', sub: 'Infra · Google',     university: 'NUS',  company: 'co-google', warmness: 50, val: 9 },

    { id: 'sk-ml',    name: 'Machine Learning', kind: 'skill',     val: 6 },
    { id: 'sk-react', name: 'React',            kind: 'skill',     val: 6 },
    { id: 'sk-py',    name: 'Python',           kind: 'skill',     val: 6 },
    { id: 'cm-ai',    name: 'AI/ML Malaysia',   kind: 'community', val: 7 },
    { id: 'cm-fin',   name: 'Fintech KL',       kind: 'community', val: 7 },
  ],
  edges: [
    { from: 'user',  to: 'p-1',  warm: true,  weight: 0.9, edgeType: 'knows' },
    { from: 'user',  to: 'p-3',  warm: false, weight: 0.7, edgeType: 'knows' },
    { from: 'user',  to: 'p-6',  warm: false, weight: 0.75, edgeType: 'knows' },
    { from: 'user',  to: 'p-9',  warm: false, weight: 0.65, edgeType: 'knows' },
    { from: 'user',  to: 'p-11', warm: false, weight: 0.8,  edgeType: 'knows' },

    { from: 'p-1',  to: 'co-google', weight: 1, edgeType: 'worked_at' },
    { from: 'p-2',  to: 'co-google', weight: 1, edgeType: 'worked_at' },
    { from: 'p-8',  to: 'co-google', weight: 1, edgeType: 'worked_at' },
    { from: 'p-12', to: 'co-google', weight: 1, edgeType: 'worked_at' },
    { from: 'p-4',  to: 'co-stripe', weight: 1, edgeType: 'worked_at' },
    { from: 'p-5',  to: 'co-stripe', weight: 1, edgeType: 'worked_at' },
    { from: 'p-11', to: 'co-stripe', weight: 1, edgeType: 'worked_at' },
    { from: 'p-3',  to: 'co-grab',   weight: 1, edgeType: 'worked_at' },
    { from: 'p-9',  to: 'co-grab',   weight: 1, edgeType: 'worked_at' },
    { from: 'p-6',  to: 'co-shopee', weight: 1, edgeType: 'worked_at' },
    { from: 'p-10', to: 'co-shopee', weight: 1, edgeType: 'worked_at' },
    { from: 'p-7',  to: 'co-airbnb', weight: 1, edgeType: 'worked_at' },

    { from: 'p-1',  to: 'p-2',  weight: 0.6, edgeType: 'knows' },
    { from: 'p-1',  to: 'p-8',  weight: 0.5, edgeType: 'knows' },
    { from: 'p-3',  to: 'p-9',  weight: 0.8, edgeType: 'knows' },
    { from: 'p-4',  to: 'p-5',  weight: 0.7, edgeType: 'knows' },

    { from: 'user', to: 'sk-ml',    weight: 1, edgeType: 'has_skill' },
    { from: 'user', to: 'sk-react', weight: 1, edgeType: 'has_skill' },
    { from: 'user', to: 'sk-py',    weight: 1, edgeType: 'has_skill' },
    { from: 'p-1',  to: 'sk-ml',   weight: 1, edgeType: 'has_skill' },
    { from: 'p-2',  to: 'sk-ml',   weight: 1, edgeType: 'has_skill' },

    { from: 'user', to: 'cm-ai', weight: 1, edgeType: 'member_of' },
    { from: 'p-1',  to: 'cm-ai', weight: 1, edgeType: 'member_of' },
    { from: 'p-2',  to: 'cm-ai', weight: 1, edgeType: 'member_of' },
  ]
}

export const DEMO_USER_ID = 'user'
export const DEMO_TARGET = 'co-google'
export const WARM_PATH_IDS = ['user', 'p-1', 'p-2', 'co-google']
