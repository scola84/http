import { setupClient } from '@scola/codec';

import {
  BodyParser,
  BodyWriter,
  ClientConnector,
  ClientMediator,
  ConnectionHeader,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentLengthHeader,
  ContentTypeDecoder,
  ContentTypeEncoder,
  ContinueResponder,
  DateHeader,
  HeaderFieldsParser,
  HeaderFieldsWriter,
  RequestLineWriter,
  ResponseLineParser,
  ResponseTransformer,
  TrailerFieldsParser,
  TrailerFieldsWriter,
  TransferEncodingDecoder,
  TransferEncodingEncoder,
  UpgradeResponder
} from '../worker';

export default function createClient(options = {}) {
  const {
    log = 0,
      setup = setupClient
  } = options;

  const bodyParser = new BodyParser();
  const bodyWriter = new BodyWriter();
  const clientConnector = new ClientConnector();
  const clientMediator = new ClientMediator();
  const connectionHeader = new ConnectionHeader();
  const contentEncodingDecoder = new ContentEncodingDecoder();
  const contentEncodingEncoder = new ContentEncodingEncoder();
  const contentLengthHeader = new ContentLengthHeader();
  const contentTypeDecoder = new ContentTypeDecoder();
  const contentTypeEncoder = new ContentTypeEncoder();
  const continueResponder = new ContinueResponder();
  const dateHeader = new DateHeader();
  const headerFieldsParser = new HeaderFieldsParser();
  const headerFieldsWriter = new HeaderFieldsWriter();
  const requestLineWriter = new RequestLineWriter();
  const responseLineParser = new ResponseLineParser();
  const responseTransformer = new ResponseTransformer();
  const trailerFieldsParser = new TrailerFieldsParser();
  const trailerFieldsWriter = new TrailerFieldsWriter();
  const transferEncodingDecoder = new TransferEncodingDecoder();
  const transferEncodingEncoder = new TransferEncodingEncoder();
  const upgradeResponder = new UpgradeResponder();

  clientConnector
    .connect(contentTypeEncoder)
    .connect(contentEncodingEncoder)
    .connect(transferEncodingEncoder)
    .connect(contentLengthHeader)
    .connect(connectionHeader)
    .connect(dateHeader)
    .connect(headerFieldsWriter)
    .connect(requestLineWriter)
    .connect(trailerFieldsWriter)
    .connect(bodyWriter)
    .connect(clientMediator)
    .connect(responseLineParser)
    .connect(headerFieldsParser)
    .connect(continueResponder)
    .connect(upgradeResponder)
    .connect(bodyParser)
    .connect(transferEncodingDecoder)
    .connect(trailerFieldsParser)
    .connect(contentEncodingDecoder)
    .connect(contentTypeDecoder)
    .connect(responseTransformer);

  clientConnector
    .bypass(clientMediator);

  clientMediator
    .bypass(responseTransformer);

  if ((log & 1) === 1) {
    bodyWriter.setLog('data');
  }

  if ((log & 2) === 2) {
    clientMediator.setLog('data');
  }

  return setup({
    connector: clientConnector,
    transformer: responseTransformer
  });
}
