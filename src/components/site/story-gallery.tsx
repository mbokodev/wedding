import type { StoryMedia } from "@/config/public-content";
import { PhotoMemory } from "@/components/site/photo-memory";

/** Un album peut mélanger des photos agrandissables et des vidéos avec commandes natives. */
export function StoryGallery({ media, caption }: { media: StoryMedia[]; caption: string }) {
  const renderMedia = (item: StoryMedia, index: number) => item.kind === "image" ?
      <PhotoMemory key={`${item.photo.src}-${index}`} photo={item.photo} caption={item.caption ?? caption} sizes="(max-width: 767px) 90vw, 50vw" /> :
      <figure className="story-video photo-memory" key={`${item.src}-${index}`}>
        <video controls playsInline preload="none" poster={item.poster} aria-label={item.title}>
          <source src={item.src} />
          {item.captionsSrc && <track kind="captions" src={item.captionsSrc} srcLang="fr" label="Français" default />}
          Votre navigateur ne peut pas lire cette vidéo. <a href={item.src}>Télécharger la vidéo</a>
        </video>
        <figcaption><span>{item.title}</span><small>{item.description}</small></figcaption>
      </figure>
    ;
  return <>
    <div className={`story-album-grid${media.length === 1 ? " story-album-single" : ""}`} role="group" aria-label="Photos et vidéos de ce chapitre" tabIndex={media.length > 1 ? 0 : undefined}>
      {media.slice(0, 3).map(renderMedia)}
    </div>
    {media.length > 1 && <p className="story-swipe-hint">Faites défiler les souvenirs <span aria-hidden="true">↔</span></p>}
    {media.length > 3 && <details className="story-more-memories"><summary>Voir nos autres souvenirs <span aria-hidden="true">＋</span></summary><div className="story-extra-grid">{media.slice(3).map(renderMedia)}</div></details>}
  </>;
}
