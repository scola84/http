import {
  BodyParser,
  BodyWriter,
  ChunkedDecoder,
  ChunkedEncoder,
  ClientConnector,
  ClientMediator,
  ConnectionHeader,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentLengthHeader,
  ContentTypeDecoder,
  ContentTypeEncoder,
  ContentTypeHeader,
  DateHeader,
  FormdataEncoder,
  HeaderFieldsParser,
  HeaderFieldsWriter,
  HtmlDecoder,
  HtmlEncoder,
  JsonDecoder,
  JsonEncoder,
  MsgpackDecoder,
  MsgpackEncoder,
  OctetStreamDecoder,
  PlainDecoder,
  PlainEncoder,
  RequestLineWriter,
  ResponseLineParser,
  ResponseTransformer,
  TrailerFieldsParser,
  TrailerFieldsWriter,
  TransferEncodingDecoder,
  TransferEncodingEncoder,
  UrlencodedDecoder,
  UrlencodedEncoder
} from '../worker'

export function createClient (type = 'values') {
  const bodyParser = new BodyParser()
  const bodyWriter = new BodyWriter()
  const clientConnector = new ClientConnector()
  const clientMediator = new ClientMediator()
  const chunkedDecoder = new ChunkedDecoder()
  const chunkedEncoder = new ChunkedEncoder()
  const connectionHeader = new ConnectionHeader()
  const contentEncodingDecoder = new ContentEncodingDecoder()
  const contentEncodingEncoder = new ContentEncodingEncoder()
  const contentLengthHeader = new ContentLengthHeader()
  const contentTypeDecoder = new ContentTypeDecoder()
  const contentTypeEncoder = new ContentTypeEncoder()
  const contentTypeHeader = new ContentTypeHeader()
  const dateHeader = new DateHeader()
  const formdataEncoder = new FormdataEncoder()
  const headerFieldsParser = new HeaderFieldsParser()
  const headerFieldsWriter = new HeaderFieldsWriter()
  const htmlDecoder = new HtmlDecoder()
  const htmlEncoder = new HtmlEncoder()
  const jsonDecoder = new JsonDecoder()
  const jsonEncoder = new JsonEncoder()
  const msgpackDecoder = new MsgpackDecoder()
  const msgpackEncoder = new MsgpackEncoder()
  const octetStreamDecoder = new OctetStreamDecoder()
  const plainDecoder = new PlainDecoder()
  const plainEncoder = new PlainEncoder()
  const requestLineWriter = new RequestLineWriter()
  const responseLineParser = new ResponseLineParser()
  const responseTransformer = new ResponseTransformer()
  const trailerFieldsParser = new TrailerFieldsParser()
  const trailerFieldsWriter = new TrailerFieldsWriter()
  const transferEncodingDecoder = new TransferEncodingDecoder()
  const transferEncodingEncoder = new TransferEncodingEncoder()
  const urlencodedDecoder = new UrlencodedDecoder()
  const urlencodedEncoder = new UrlencodedEncoder()

  clientConnector
    .connect(contentTypeHeader)
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
    .connect(bodyParser)
    .connect(transferEncodingDecoder)
    .connect(trailerFieldsParser)
    .connect(contentEncodingDecoder)
    .connect(contentTypeDecoder)
    .connect(responseTransformer)

  clientConnector
    .bypass(clientMediator)

  clientMediator
    .bypass(responseTransformer)

  contentTypeDecoder
    .setDefault('application/octet-stream')
    .setStrict(false)
    .manage(htmlDecoder.getType(), htmlDecoder)
    .manage(jsonDecoder.getType(), jsonDecoder)
    .manage(msgpackDecoder.getType(), msgpackDecoder)
    .manage(octetStreamDecoder.getType(), octetStreamDecoder)
    .manage(plainDecoder.getType(), plainDecoder)
    .manage(urlencodedDecoder.getType(), urlencodedDecoder)

  contentTypeEncoder
    .setStrict(false)
    .manage(formdataEncoder.getType(), formdataEncoder)
    .manage(htmlEncoder.getType(), htmlEncoder)
    .manage(jsonEncoder.getType(), jsonEncoder)
    .manage(msgpackEncoder.getType(), msgpackEncoder)
    .manage(plainEncoder.getType(), plainEncoder)
    .manage(urlencodedEncoder.getType(), urlencodedEncoder)

  contentTypeHeader
    .addType(jsonEncoder.getType())
    .addType(formdataEncoder.getType())

  transferEncodingDecoder
    .manage(chunkedDecoder.getEncoding(), chunkedDecoder)

  transferEncodingEncoder
    .manage(chunkedEncoder.getEncoding(), chunkedEncoder)

  return Object[type]({
    connector: clientConnector,
    transformer: responseTransformer
  })
}
