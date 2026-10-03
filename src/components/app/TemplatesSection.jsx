import React, { useMemo } from 'react';
import SectionHeader from '@/components/app/SectionHeader';
import TemplateSelector from '@/components/app/TemplateSelector';
import { safeMatrix, sampleMatrix } from '@/services/qrService';

export default function TemplatesSection({ project, onApply }) {
  const matrix = useMemo(() => safeMatrix(project), [project]);
  return (
    <div className="px-5 py-10 md:px-10 md:py-16">
      <SectionHeader index="03" title="Templates" meta={`${matrix ? 'Previewed on your code' : 'Previewed on a sample pattern'}`} />
      <p className="mt-6 max-w-xl text-mute">Presets restyle colours, gradient, shape and margin. They never touch your encoded content, and you can fine-tune everything afterwards.</p>
      <div className="mt-12">
        <TemplateSelector variant="gallery" matrix={matrix || sampleMatrix()} customization={project.customization} onApply={onApply} />
      </div>
    </div>
  );
}