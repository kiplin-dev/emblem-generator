import EmblemGenerator from './EmblemGenerator';

const emblemGenerator = new EmblemGenerator();

if (!window.emblemGenerator) {
  window.emblemGenerator = emblemGenerator;
}
