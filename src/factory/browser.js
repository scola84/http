import { setupBrowser } from '@scola/codec';

import {
  BodyParser,
  BrowserConnector,
  BrowserMediator,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentTypeDecoder,
  ContentTypeEncoder,
  HeaderFieldsParser,
  ResponseLineParser,
  ResponseTransformer,
  TrailerFieldsParser,
  TransferEncodingDecoder,
  TransferEncodingEncoder
} from '../worker';

export function createBrowser(options = {}) {
  const {
    setup = setupBrowser
  } = options;

  const bodyParser = new BodyParser();
  const browserConnector = new BrowserConnector();
  const browserMediator = new BrowserMediator();
  const contentEncodingDecoder = new ContentEncodingDecoder();
  const contentEncodingEncoder = new ContentEncodingEncoder();
  const contentTypeDecoder = new ContentTypeDecoder();
  const contentTypeEncoder = new ContentTypeEncoder();
  const headerFieldsParser = new HeaderFieldsParser();
  const responseLineParser = new ResponseLineParser();
  const responseTransformer = new ResponseTransformer();
  const trailerFieldsParser = new TrailerFieldsParser();
  const transferEncodingDecoder = new TransferEncodingDecoder();
  const transferEncodingEncoder = new TransferEncodingEncoder();

  browserConnector
    .connect(contentTypeEncoder)
    .connect(contentEncodingEncoder)
    .connect(transferEncodingEncoder)
    .connect(browserMediator)
    .connect(responseLineParser)
    .connect(headerFieldsParser)
    .connect(bodyParser)
    .connect(transferEncodingDecoder)
    .connect(trailerFieldsParser)
    .connect(contentEncodingDecoder)
    .connect(contentTypeDecoder)
    .connect(responseTransformer);

  browserConnector
    .bypass(browserMediator);

  browserMediator
    .bypass(responseTransformer);

  return setup({
    connector: browserConnector,
    transformer: responseTransformer
  });
}
