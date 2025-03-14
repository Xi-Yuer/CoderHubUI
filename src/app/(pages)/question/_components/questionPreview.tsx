"use client"
import React from 'react'
import { MdPreview, MdCatalog } from "md-editor-rt";

interface QuestionPreviewProps {
    content: string
}
export default function QuestionPreview({ content }: QuestionPreviewProps) {
    return (
        <div>
            <MdPreview value={content} />
        </div>
    )
}
