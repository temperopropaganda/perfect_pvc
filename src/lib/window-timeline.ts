// Progresso do scroll da seção (0 a 1) para o tempo normalizado do clip "OsciloGiro" do GLB.
// O clip foi feito no Blender assim: 0 fechada · 0.25 oscilobatente aberta · 0.5 fechada ·
// 0.75 giro aberto · 1 fechada. Cada trecho já tem easing, então aqui o mapeamento é linear.
// O giro (78°) recebe um pouco mais de rolagem que o tombamento (11°) para os dois terem
// velocidade visual parecida. As pontas fechadas dão respiro ao entrar e ao sair do pin.
const KEYS: ReadonlyArray<readonly [scroll: number, clip: number]> = [
  [0, 0],
  [0.05, 0],
  [0.23, 0.25],
  [0.41, 0.5],
  [0.63, 0.75],
  [0.86, 1],
  [1, 1],
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const clipProgressAt = (scroll: number) => {
  const p = clamp01(scroll);
  for (let i = 1; i < KEYS.length; i += 1) {
    const [s0, c0] = KEYS[i - 1];
    const [s1, c1] = KEYS[i];
    if (p <= s1) return c0 + ((p - s0) / (s1 - s0)) * (c1 - c0);
  }
  return 1;
};

// Item da lista ao lado da janela: 0 fechada, 1 tomba, 2 gira.
export const windowStepAt = (scroll: number) => {
  if (scroll < 0.05 || scroll >= 0.86) return 0;
  return scroll < 0.41 ? 1 : 2;
};
