# Criador de personagem e recompensas LPC — 0.4

## Integração

Fonte: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
Commit fixado: 4963a69795255fb15a934c47f478a8bdcf3668f5.

Integração local, sem iframe e sem depender do site durante o uso. Incluímos 57 PNGs originais, correspondentes a 23 linhas de créditos, e um catálogo inicial de 20 equipamentos. Não incorporamos todo o catálogo nem o código GPL do gerador. As camadas são compostas por código próprio React/Canvas, em ordem Z.

Os PNGs possuem nove frames por linha e quatro direções, cada célula de 64×64. A pose parada usa o frame inicial da caminhada. Somente a animação walk é usada nesta versão. Não há combate, física ou exportação de spritesheet no editor.

## Arquitetura

- `character-model.ts`: tipos, bases, regras de compatibilidade e seleção de drops.
- `lpc-catalog.json`: IDs permanentes, raridades, slots, camadas por base e paletas.
- `CharacterSprite.tsx`: composição, cache de imagens, paletas e animação.
- `CharacterPanel.tsx`: editor, peças desbloqueadas, prévias, créditos.
- `public/lpc/manifest.json`: caminho original e SHA-256 de cada PNG.
- `public/lpc/credits.json`: autores, fontes, licenças e licença selecionada por asset.
- `scripts/verify-lpc.mjs`: valida arquivos, dimensões, catálogo, créditos e licenças.

Recoloração: pele usa a paleta light como origem; cabelos usam orange. Algumas roupas já têm variantes prontas no acervo. Nas demais, a correspondência de seis cores fica registrada no catálogo e é aplicada em memória. Os arquivos PNG distribuídos não foram alterados. Prévia, tintas e composição podem constituir arte derivada; mantenha os créditos e as condições das licenças ao redistribuí-las.

## Identidade e equipamentos

3 bases, 5 tons de pele e 6 cores de cabelo. Adultos têm quatro estilos de cabelo; a base infantil tem um estilo validado. O formato de corpo não determina o nome ou a identidade da pessoa.

Slots: traje, calça, pés, costas e cabeça. Traje e calça básicos permanecem equipados. Pés, costas e cabeça podem ficar vazios. A mudança de corpo remove equipamentos incompatíveis da aparência, mas mantém sua propriedade. Os sprites infantis não usam acessórios adultos redimensionados; evitamos encaixes incorretos.

A coleção inicial contém traje azul, calça escura e botas de couro. Botas ficam disponíveis para adultos; a base infantil possui 10 peças compatíveis de traje/calça. As bases adultas usam as 20 peças. Itens bloqueados podem ser experimentados apenas visualmente. O processo de domínio valida propriedade e compatibilidade antes de equipar.

## Economia

Por primeira conclusão elegível: 70% sem item; faixa de 20% comum, 8% raro e 2% épico. O sorteio escolhe uma peça compatível ainda não obtida. Se a raridade sorteada não tiver peças novas compatíveis, escolhe entre as demais faltantes. Por isso, as frequências efetivas mudam à medida que a coleção é completada e de acordo com a base usada.

Se todas as peças compatíveis já estiverem desbloqueadas, o resultado de drop concede 20 Gold extras. Não há duplicatas na coleção. Alterar base não remove recompensas. Missões já recompensadas continuam protegidas contra novos pagamentos e sorteios.

Os IDs das relíquias antigas (ember, moon e crown) foram mantidos. O mercado antigo continua vendendo essas relíquias. Equipamentos LPC são conquistados por missões nesta versão; não há venda de caixas ou dinheiro real.

## Dados existentes

Formato de save v1 recebe dois campos opcionais com valores padrão na leitura: `character` e `wardrobe`. Não são zerados EXP, Gold, tarefas, calendário ou relíquias. O save é escrito normalmente na próxima alteração. IDs de cosméticos devem permanecer estáveis em futuras versões. Uma futura remoção de item deve vir com migração explícita.

## Licenças e créditos

Cada arquivo mantém as opções de licença do acervo. Selecionamos CC0, CC BY 3.0 ou CC BY-SA 3.0 conforme o asset, registradas individualmente. Os textos de licença acompanham os PNGs. As composições que incluem arte ShareAlike devem continuar com os respectivos créditos e condições de compartilhamento. Não remover autoria nem atribuir a arte LPC ao QuestDesk. O bloqueio de equipamento é uma regra de progressão local, não uma proteção dos arquivos artísticos.

Os créditos são carregados do mesmo pacote local e abrem dentro do app. URLs de origem e licenças permanecem visíveis. A licença de uma imagem não deve ser inferida pela pasta ou aplicada automaticamente a todo o acervo.

## Ampliar o catálogo

1. Fixar uma revisão do acervo e verificar a licença/autoria da peça exata.
2. Selecionar frames walk 64×64 compatíveis com a base.
3. Copiar PNGs originais, preservar créditos e registrar hashes.
4. Adicionar um ID estável e suas camadas por base no catálogo.
5. Verificar frente, costas, lados, caminhada, cabelo e sobreposição com as roupas.
6. Definir slot, raridade e se é inicial; testar propriedade e migração.

Não considerar todo o acervo disponível apenas por existir no gerador online. O pacote atual é uma seleção validada para este aplicativo.

## Validação e limites

18 testes de domínio passaram, cobrindo dados antigos, drops, ausência de duplicatas, propriedade, compatibilidade e persistência. Smoke test Chromium passou para as três bases, edição, prévia bloqueada, drop de missão, equipamento, recarga, giro, animação, créditos e largura mínima de 1000 px. Inspeção visual de personagens infantis e adultos foi realizada.

Os screenshots usam um drop forçado somente no teste de navegador; o aplicativo distribuído mantém a aleatoriedade normal. Instalação e execução nativa no Windows ainda precisam de validação.
