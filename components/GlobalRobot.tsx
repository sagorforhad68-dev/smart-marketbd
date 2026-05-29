'use client'

import dynamic from 'next/dynamic'

const RobotCursor = dynamic(() => import('@/app/components/RobotCursor'), { ssr: false })

export default function GlobalRobot() {
  return <RobotCursor />
}
