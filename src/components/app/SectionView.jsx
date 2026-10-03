import React from 'react';
import CreateSection from '@/components/app/CreateSection';
import LibrarySection from '@/components/app/LibrarySection';
import TemplatesSection from '@/components/app/TemplatesSection';
import DownloadsSection from '@/components/app/DownloadsSection';
import SettingsSection from '@/components/app/SettingsSection';

export default function SectionView({ section, qr, deck, setDeck, actions, library, favoriteIds, notify, onOpenProject, onRemove, onApplyTemplate, onClear, onCreate }) {
  switch (section) {
    case 'recents':
      return (
        <LibrarySection
          index="02" title="Recents" meta={`${library.recents.length} / 20 slots`} items={library.recents} favoriteIds={favoriteIds}
          onOpen={onOpenProject} onToggleFavorite={actions.toggleFavorite} onDelete={(p) => onRemove('recents', p, 'Recent')}
          emptyTitle="Nothing saved yet" emptyText="Save a code from the generator and it will live here — up to 20 projects." onCreate={onCreate}
        />
      );
    case 'templates':
      return <TemplatesSection project={qr.project} onApply={onApplyTemplate} />;
    case 'favorites':
      return (
        <LibrarySection
          index="04" title="Favorites" meta={`${library.favorites.length} pinned`} items={library.favorites} favoriteIds={favoriteIds}
          onOpen={onOpenProject} onToggleFavorite={(p) => onRemove('favorites', p, 'Favorite')}
          emptyTitle="No favorites yet" emptyText="Tap the star on any code to pin it here. Favorites stay even if you delete the Recent." onCreate={onCreate}
        />
      );
    case 'downloads':
      return <DownloadsSection items={library.downloads} onDelete={(r) => onRemove('downloads', r, 'Download')} onCreate={onCreate} />;
    case 'settings':
      return <SettingsSection onClear={onClear} />;
    default:
      return <CreateSection qr={qr} deck={deck} setDeck={setDeck} actions={actions} isFavorite={favoriteIds.has(qr.project.id)} notify={notify} />;
  }
}