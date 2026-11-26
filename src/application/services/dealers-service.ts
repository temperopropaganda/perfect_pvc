import type { DealerType } from "@src/domain/types/dealer-type";

// Lojas parceiras publicadas em perfectpvc.com.br/onde-comprar (consultado em 2026-11-24).
const DEALERS: DealerType[] = [
  {
    name: "Norte Esquadrias",
    city: "Florianópolis",
    state: "SC",
    region: "Sul",
    address: "Rodovia José Carlos Daux, 8600, Corporate Park, bloco 1, sala 3",
    phones: ["(48) 99614-9292"],
    email: "contato@norteesquadrias.com.br",
    instagram: "norteesquadrias",
  },
  {
    name: "Super Class Comércio de Esquadrias de PVC",
    city: "São Paulo",
    state: "SP",
    region: "Sudeste",
    address: "Alameda dos Guaramomis, 342, Moema",
    phones: ["(11) 5052-3466", "(11) 98996-6721"],
    email: "raul@superclasspvc.com.br",
    instagram: "superclasspvc",
  },
  {
    name: "Casa Pereira Esquadrias",
    city: "Poços de Caldas",
    state: "MG",
    region: "Sudeste",
    address: "Avenida João Pinheiro, 133, Campo da Mogiana",
    phones: ["(35) 98462-0988"],
    email: "auxiliovendas@casapereira.com",
    instagram: "casapereiraesquadrias",
  },
  {
    name: "Requinte de Teresópolis Decorações",
    city: "Teresópolis",
    state: "RJ",
    region: "Sudeste",
    address: "Avenida Alberto Torres, 1168, Bairro Alto",
    phones: ["(21) 98177-9614"],
    email: "vendas@requinteteresopolis.com",
    instagram: "requinte_teresopolis",
  },
  {
    name: "Casa Bem Soluções e Comércio de Esquadrias",
    city: "Rondonópolis",
    state: "MT",
    region: "Centro-Oeste",
    address: "Rua Raimundos de Matos Filho, 222, Coophasen",
    phones: ["(66) 3022-0104", "(66) 99902-1778"],
    email: "diretoria@grupocasabem.com.br",
    instagram: "casabem",
  },
  {
    name: "Forefront Representações",
    city: "Cuiabá",
    state: "MT",
    region: "Centro-Oeste",
    address: "Rua João Bento, 170, Galeria Villa Grecco, Quilombo",
    phones: ["(65) 98141-6560"],
    email: "contato@forefrontmentoria.com.br",
    instagram: "forefront.co",
  },
  {
    name: "Speciale Esquadrias em PVC",
    city: "Rio Verde",
    state: "GO",
    region: "Centro-Oeste",
    address: "Rua O, 1044, loja 231, Buriti Shopping",
    phones: ["(64) 99613-1820"],
    email: "specialeesquadrias@gmail.com",
    instagram: "speciale.pvc",
  },
  {
    name: "Arte Piso Comércio e Serviços de Revestimentos",
    city: "Fortaleza",
    state: "CE",
    region: "Nordeste",
    address: "Avenida Presidente Costa e Silva, 2527-A",
    phones: ["(85) 4012-9900"],
    email: "artepiso@artepisoconceito.com.br",
    instagram: "grupoartepiso",
  },
  {
    name: "GCO Representações",
    city: "João Pessoa",
    state: "PB",
    region: "Nordeste",
    address: "Avenida Bananeiras, 361, Manaíra",
    phones: ["(83) 99657-9900"],
    email: "gcorepresentacoes@hotmail.com",
    instagram: "gcoperfect",
  },
];

const REGION_ORDER: DealerType["region"][] = [
  "Sul",
  "Sudeste",
  "Centro-Oeste",
  "Nordeste",
  "Norte",
];

export const dealersService = {
  list: (): DealerType[] => DEALERS,

  groupedByRegion: () =>
    REGION_ORDER.map((region) => ({
      region,
      dealers: DEALERS.filter((dealer) => dealer.region === region),
    })).filter((group) => group.dealers.length > 0),

  states: (): string[] => [...new Set(DEALERS.map((dealer) => dealer.state))],
};
