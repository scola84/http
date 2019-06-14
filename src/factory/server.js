import { setupServer } from '@scola/codec';
import net from 'net';

import {
  BodyParser,
  BodyWriter,
  ConnectionHeader,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentEncodingHeader,
  ContentLengthHeader,
  ContentTypeDecoder,
  ContentTypeEncoder,
  ContentTypeHeader,
  ContinueResponder,
  DateHeader,
  ErrorResolver,
  ResultResolver,
  HeaderFieldsParser,
  HeaderFieldsWriter,
  PathRouter,
  RequestLineParser,
  RequestRouter,
  ResponseLineWriter,
  ServerConnector,
  TrailerFieldsParser,
  TrailerFieldsWriter,
  TransferEncodingDecoder,
  TransferEncodingEncoder,
  TransferEncodingHeader,
  UpgradeResponder
} from '../worker';

export default function createServer(options = {}) {
  const {
    listen = 3000,
      log = 0,
      router = 'request',
      setup = setupServer
  } = options;

  const bodyParser = new BodyParser();
  const bodyWriter = new BodyWriter();
  const connectionHeader = new ConnectionHeader();
  const contentEncodingDecoder = new ContentEncodingDecoder();
  const contentEncodingEncoder = new ContentEncodingEncoder();
  const contentEncodingHeader = new ContentEncodingHeader();
  const contentLengthHeader = new ContentLengthHeader();
  const contentTypeDecoder = new ContentTypeDecoder();
  const contentTypeEncoder = new ContentTypeEncoder();
  const contentTypeHeader = new ContentTypeHeader();
  const continueResponder = new ContinueResponder();
  const dateHeader = new DateHeader();
  const errorResolver = new ErrorResolver();
  const headerFieldsParser = new HeaderFieldsParser();
  const headerFieldsWriter = new HeaderFieldsWriter();
  const requestLineParser = new RequestLineParser();
  const responseLineWriter = new ResponseLineWriter();
  const resultResolver = new ResultResolver();
  const serverConnector = new ServerConnector();
  const trailerFieldsParser = new TrailerFieldsParser();
  const trailerFieldsWriter = new TrailerFieldsWriter();
  const transferEncodingDecoder = new TransferEncodingDecoder();
  const transferEncodingEncoder = new TransferEncodingEncoder();
  const transferEncodingHeader = new TransferEncodingHeader();
  const upgradeResponder = new UpgradeResponder();

  const routers = {
    path: new PathRouter(),
    request: new RequestRouter()
  };

  serverConnector
    .connect(requestLineParser)
    .connect(headerFieldsParser)
    .connect(continueResponder)
    .connect(upgradeResponder)
    .connect(bodyParser)
    .connect(transferEncodingDecoder)
    .connect(trailerFieldsParser)
    .connect(contentEncodingDecoder)
    .connect(contentTypeDecoder)
    .connect(routers[router]);

  resultResolver
    .connect(errorResolver)
    .connect(contentTypeHeader)
    .connect(contentEncodingHeader)
    .connect(transferEncodingHeader)
    .connect(contentTypeEncoder)
    .connect(contentEncodingEncoder)
    .connect(transferEncodingEncoder)
    .connect(contentLengthHeader)
    .connect(connectionHeader)
    .connect(dateHeader)
    .connect(headerFieldsWriter)
    .connect(responseLineWriter)
    .connect(trailerFieldsWriter)
    .connect(bodyWriter);

  if ((log & 1) === 1) {
    serverConnector.setLog('data');
  }

  if ((log & 2) === 2) {
    bodyWriter.setLog('data');
  }

  if (listen) {
    net.createServer((socket) => {
      serverConnector.handle(socket);
    }).listen(listen);
  }

  return setup({
    connector: serverConnector,
    resolver: resultResolver,
    router: routers[router],
    writer: bodyWriter
  });
}
