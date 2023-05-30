# Web3DevMarketplace

Este é o repositório do projeto Web3DevMarketplace desenvolvido pela equipe "Morcegos" para o Hackathon Pod Labs.

## Links do Hackathon

- [Edital do Hackathon](https://docs.web3dev.com.br/pods/hackathon-pod-labs/edital-geral)
- [Edital dos Temas e Premiações](https://docs.web3dev.com.br/pods/hackathon-pod-labs/edital-dos-temas)

## Equipe

- Nome da equipe: Morcegos
- Nome dos integrantes: Gustavo Gaertner Boehm

## Grants aplicados

- Melhor contrato inteligênte e atendimento às funcionalidades propostas.

## Tecnologias

 - Rect
 - Solidity
 - Hardhat
 - Node
 - Npm
 - Javascript

## Pitch

Você tem uma ideia de desenvolvimento, mas não sabe como colocá-la em prática? Ou talvez você seja um desenvolvedor procurando por novos projetos interessantes para trabalhar? O Web3DevMarketplace é a solução para você!

Nosso produto é uma plataforma descentralizada que permite a criação e gerenciamento de atividades de desenvolvimento, tudo isso em um ambiente seguro e transparente fornecido pela blockchain. Com o uso de tokens ERC721, os líderes podem criar atividades com recompensas em criptomoedas e os membros podem se candidatar a elas. Após a conclusão das atividades, os líderes podem aprovar ou rejeitar o trabalho, garantindo a qualidade e a confiabilidade do trabalho realizado.

O Web3DevMarketplace é uma maneira inovadora de conectar líderes e desenvolvedores, criando uma comunidade de profissionais de desenvolvimento talentosos e experientes. Junte-se a nós e comece a construir projetos incríveis hoje mesmo!

## Descrição do Produto

Web3DevMarketplace é um produto que permite a criação e gerenciamento de atividades de desenvolvimento em uma plataforma descentralizada. Com o uso de tokens ERC721, os líderes podem criar novas atividades com recompensas em criptomoedas, e os membros podem se candidatar a essas atividades, realizá-las e receber as recompensas. Além disso, os líderes podem aprovar ou rejeitar as atividades concluídas pelos membros, garantindo a qualidade e a confiabilidade do trabalho. Com transparência e segurança fornecidas pela blockchain.

## Como testar/compilar o produto

### Pré-requisitos

- Certifique-se de ter o Node.js instalado em seu ambiente de desenvolvimento.
- Certifique-se de ter o NPM instalado em seu ambiente de desenvolvimento.
- Certifique-se de configurar a Metamask com nó local do hardhat.

## Instalação

1. Clone este repositório.

### Iniciar hardhat e deploy do contrato

1. Navegue para pasta Contract.
2. Execute npm install.
3. Execute npx hardhat node e deixe esse terminal aberto.
4. Abra um novo terminal na mesma pasta e execute npx hardhat run --network localhost scripts/deploy.js.
5. Pronto, contrato deployado.

### Configuração do frontend

1. Navegue para Frontend.
2. Execute npm install.
3. Execute npm start.
4. Acessar http://localhost:3000/

### Executar testes unitários

1. Navegue para pasta Contract.
2. Execute npx hardhat test.

### Configuração da MetaMask

Adicione uma nova conta com a private key listada no comando 3 da sessão Iniciar hardhat e deploy do contrato.

![hardhat_node](https://uploaddeimagens.com.br/images/004/471/482/full/Captura_de_Tela_2023-05-17_a%CC%80s_20.50.28.png?1684367441)

Adicione uma nova rede com as seguintes configurações:

![config](https://uploaddeimagens.com.br/images/004/471/481/original/Captura_de_Tela_2023-05-17_a%CC%80s_19.41.01.png?1684367278)

## Dificuldades:
Como se trata do meu primeiro projeto web3, tudo foi um desafio.
Tenho pouca experiencia com react e solidity, gastei muito tempo entendo como fazer as coisas e fazendo funcionar, cada nova implementação era um desafio novo.
Tendo em vista a minha experiência e o tempo que tive para desenvolver isso estou feliz com o resultado. 

## Visão de futuro:
Minha visão para o futuro inclui a adição de novas funcionalidades ao smart contract e a modularização do código para torná-lo mais flexível e escalável. Também estou planejando implementar um novo layout no frontend e aprimorar a estrutura do projeto como um todo.

Uma meta importante para mim é a implementação do IPFS para gerenciar os conteúdos das atividades de forma descentralizada e mais segura. Além disso, quero adicionar um sistema de pontos às atividades, permitindo que os usuários subam de nível e ganhem benefícios exclusivos na plataforma.

Para tornar o processo de aprovação das atividades mais eficiente, estou trabalhando em fluxos alternativos de aprovação que sejam mais flexíveis e personalizáveis para atender às necessidades dos usuários.

Estou animado em usar este projeto como meu primeiro case de desenvolvimento na web3 e aprender com as experiências e desafios que encontrarei ao longo do caminho.