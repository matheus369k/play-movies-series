<h1 align="center">Play Movies and Series</h1>
<div align="center">
  <a href="#descriçao">Descrição</a> |
  <a href="#Iniciar">Iniciar</a> |
  <a href="#licença">Licença</a>
</div>

<p align="center">
  <img src="https://img.shields.io/github/license/matheus369k/play-movies-series.svg"/>
</p>
<p>
 <img src="./.github/preview-project.jpg" />
</p>

## Descrição
A aplicação e um site de streams de filmes se series, contendo um catalago vasto de filmes entre os anos 2000 e 2025, divididos em filmes e series. 

Os dados vem de uma api publica chamada [omdbapi.com](https://www.omdbapi.com/).

As principais funções do site são:

- filtro de dados por titulo e indentificador unico(id).
- Auto paginação por scroll.
- Carroceu de filmes, divididos em categorias.

Acesse o site [Play Movies and Series](https://matheus369k.github.io/play-movies-series/).

## Iniciar
E Necessario ter o Nodejs e o git instalado.

Faça clone do repositorio localmente.

```bash
git clone https://github.com/matheus369k/play-movies-series.git
cd ./play-movies-series
```
Instale as dependencias
```bash
npm i
```
Crie um arquivo .env, com as variaves ambientes abaixo
```bash
VITE_API_OMDBAPI=dominio
VITE_API_OMDBAPI_KEY=Chave
```
Agora você pode iniciar o projetos
```bash
npm run dev
```

## Licença

Licença ( 🔗[MIT](./LICENSE.txt) )