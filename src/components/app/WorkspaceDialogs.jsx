import React from 'react';
import NamingDialog from '@/components/app/NamingDialog';
import ConfirmDialog from '@/components/app/ConfirmDialog';
import DraftDialog from '@/components/app/DraftDialog';
import ShareFallbackDialog from '@/components/app/ShareFallbackDialog';

export default function WorkspaceDialogs({ draftPrompt, onResume, onStartNew, naming, onCloseNaming, confirm, onCloseConfirm, shareFallback, onCloseShare, onShareDownload, onShareCopy }) {
  return (
    <>
      <DraftDialog open={draftPrompt} onResume={onResume} onStartNew={onStartNew} />
      <NamingDialog request={naming} onClose={onCloseNaming} />
      <ConfirmDialog request={confirm} onClose={onCloseConfirm} />
      <ShareFallbackDialog request={shareFallback} onClose={onCloseShare} onDownload={onShareDownload} onCopy={onShareCopy} />
    </>
  );
}