import type { PhotoType } from "@src/domain/types/photo-type";

export type ProjectType = {
  slug: string;
  // Nome da pasta de fotos entregue pela Perfect (ex.: "Casa Caçador").
  name: string;
  // Título da obra em perfectpvc.com.br/obras, quando a obra está publicada lá.
  title?: string;
  place: string;
  year?: number;
  summary?: string;
  products: string[];
  cover: PhotoType;
  photos: PhotoType[];
  // Sem texto publicado: nome e cidade vêm só da pasta de fotos e precisam de validação.
  pendingInfo: boolean;
};
