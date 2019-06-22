import net from 'net';

import {
  BodyParser,
  BodyWriter,
  ChunkedDecoder,
  ChunkedEncoder,
  ConnectionHeader,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentEncodingHeader,
  ContentLengthHeader,
  ContentTypeDecoder,
  ContentTypeEncoder,
  ContentTypeHeader,
  ContinueResponder,
  DataResolver,
  DateHeader,
  ErrorResolver,
  FileResolver,
  FormdataDecoder,
  FormdataEncoder,
  HeaderFieldsParser,
  HeaderFieldsWriter,
  HtmlDecoder,
  HtmlEncoder,
  JsonDecoder,
  JsonEncoder,
  MsgpackDecoder,
  MsgpackEncoder,
  PlainDecoder,
  PlainEncoder,
  RequestLineParser,
  ResponseLineWriter,
  ServerConnector,
  TrailerFieldsParser,
  TrailerFieldsWriter,
  TransferEncodingDecoder,
  TransferEncodingEncoder,
  TransferEncodingHeader,
  UpgradeResponder,
  UrlencodedDecoder,
  UrlencodedEncoder
} from '../worker';

export function createServer(options = {}) {
  const {
    listen = 3000
  } = options;

  const bodyParser = new BodyParser();
  const bodyWriter = new BodyWriter();
  const chunkedDecoder = new ChunkedDecoder();
  const chunkedEncoder = new ChunkedEncoder();
  const connectionHeader = new ConnectionHeader();
  const contentEncodingDecoder = new ContentEncodingDecoder();
  const contentEncodingEncoder = new ContentEncodingEncoder();
  const contentEncodingHeader = new ContentEncodingHeader();
  const contentLengthHeader = new ContentLengthHeader();
  const contentTypeDecoder = new ContentTypeDecoder();
  const contentTypeEncoder = new ContentTypeEncoder();
  const contentTypeHeader = new ContentTypeHeader();
  const continueResponder = new ContinueResponder();
  const dataResolver = new DataResolver();
  const dateHeader = new DateHeader();
  const fileResolver = new FileResolver();
  const errorResolver = new ErrorResolver();
  const formdataEncoder = new FormdataEncoder();
  const formdataDecoder = new FormdataDecoder();
  const headerFieldsParser = new HeaderFieldsParser();
  const headerFieldsWriter = new HeaderFieldsWriter();
  const htmlDecoder = new HtmlDecoder();
  const htmlEncoder = new HtmlEncoder();
  const jsonDecoder = new JsonDecoder();
  const jsonEncoder = new JsonEncoder();
  const msgpackDecoder = new MsgpackDecoder();
  const msgpackEncoder = new MsgpackEncoder();
  const plainDecoder = new PlainDecoder();
  const plainEncoder = new PlainEncoder();
  const requestLineParser = new RequestLineParser();
  const responseLineWriter = new ResponseLineWriter();
  const serverConnector = new ServerConnector();
  const trailerFieldsParser = new TrailerFieldsParser();
  const trailerFieldsWriter = new TrailerFieldsWriter();
  const transferEncodingDecoder = new TransferEncodingDecoder();
  const transferEncodingEncoder = new TransferEncodingEncoder();
  const transferEncodingHeader = new TransferEncodingHeader();
  const upgradeResponder = new UpgradeResponder();
  const urlencodedDecoder = new UrlencodedDecoder();
  const urlencodedEncoder = new UrlencodedEncoder();

  serverConnector
    .connect(requestLineParser)
    .connect(headerFieldsParser)
    .connect(continueResponder)
    .connect(upgradeResponder)
    .connect(bodyParser)
    .connect(transferEncodingDecoder)
    .connect(trailerFieldsParser)
    .connect(contentEncodingDecoder)
    .connect(contentTypeDecoder);

  dataResolver
    .connect(fileResolver)
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

  contentTypeDecoder
    .setStrict(false)
    .manage(htmlDecoder.getType(), htmlDecoder)
    .manage(jsonDecoder.getType(), jsonDecoder)
    .manage(msgpackDecoder.getType(), msgpackDecoder)
    .manage(formdataDecoder.getType(), formdataDecoder)
    .manage(urlencodedDecoder.getType(), urlencodedDecoder)
    .manage(plainDecoder.getType(), plainDecoder);

  contentTypeEncoder
    .setStrict(false)
    .manage(htmlEncoder.getType(), htmlEncoder)
    .manage(jsonEncoder.getType(), jsonEncoder)
    .manage(msgpackEncoder.getType(), msgpackEncoder)
    .manage(formdataEncoder.getType(), formdataEncoder)
    .manage(plainEncoder.getType(), plainEncoder)
    .manage(urlencodedEncoder.getType(), urlencodedEncoder);

  transferEncodingDecoder
    .manage(chunkedDecoder.getEncoding(), chunkedDecoder);

  transferEncodingEncoder
    .manage(chunkedEncoder.getEncoding(), chunkedEncoder);

  contentTypeHeader
    .addType(jsonEncoder.getType())
    .addType(msgpackEncoder.getType())
    .addType(formdataEncoder.getType())
    .addType(urlencodedEncoder.getType())
    .addType(plainEncoder.getType());

  if (listen) {
    net.createServer((socket) => {
      serverConnector.handle(socket);
    }).listen(listen);
  }

  return {
    connector: serverConnector,
    decoder: contentTypeDecoder,
    resolver: dataResolver,
    writer: bodyWriter
  };
}
