'use client'
import React from 'react'
import { useParams } from 'next/navigation'

export default function OrganizationDashboard() {
  const params = useParams()
  return (
    <div>
      <h1 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 pt-50">
        {params.organizationName}
      </h1>
    </div>
  )
}
