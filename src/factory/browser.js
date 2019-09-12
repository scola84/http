import {
  BodyParser,
  BrowserConnector,
  BrowserMediator,
  ChunkedDecoder,
  ChunkedEncoder,
  ContentEncodingDecoder,
  ContentEncodingEncoder,
  ContentTypeDecoder,
  ContentTypeEncoder,
  ContentTypeHeader,
  FormdataEncoder,
  HeaderFieldsParser,
  HtmlDecoder,
  HtmlEncoder,
  JsonDecoder,
  JsonEncoder,
  MsgpackDecoder,
  MsgpackEncoder,
  OctetStreamDecoder,
  PlainDecoder,
  PlainEncoder,
  ResponseLineParser,
  ResponseTransformer,
  TrailerFieldsParser,
  TransferEncodingDecoder,
  TransferEncodingEncoder,
  UrlencodedDecoder,
  UrlencodedEncoder
} from '../worker'

export function createBrowser (type = 'create') {
  const bodyParser = new BodyParser()
  const browserConnector = new BrowserConnector()
  const browserMediator = new BrowserMediator()
  const chunkedDecoder = new ChunkedDecoder()
  const chunkedEncoder = new ChunkedEncoder()
  const contentEncodingDecoder = new ContentEncodingDecoder()
  const contentEncodingEncoder = new ContentEncodingEncoder()
  const contentTypeDecoder = new ContentTypeDecoder()
  const contentTypeEncoder = new ContentTypeEncoder()
  const contentTypeHeader = new ContentTypeHeader()
  const formdataEncoder = new FormdataEncoder()
  const headerFieldsParser = new HeaderFieldsParser()
  const htmlDecoder = new HtmlDecoder()
  const htmlEncoder = new HtmlEncoder()
  const jsonDecoder = new JsonDecoder()
  const jsonEncoder = new JsonEncoder()
  const msgpackDecoder = new MsgpackDecoder()
  const msgpackEncoder = new MsgpackEncoder()
  const octetStreamDecoder = new OctetStreamDecoder()
  const plainDecoder = new PlainDecoder()
  const plainEncoder = new PlainEncoder()
  const responseLineParser = new ResponseLineParser()
  const responseTransformer = new ResponseTransformer()
  const trailerFieldsParser = new TrailerFieldsParser()
  const transferEncodingDecoder = new TransferEncodingDecoder()
  const transferEncodingEncoder = new TransferEncodingEncoder()
  const urlencodedDecoder = new UrlencodedDecoder()
  const urlencodedEncoder = new UrlencodedEncoder()

  browserConnector
    .connect(contentTypeHeader)
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
    .connect(responseTransformer)

  browserConnector
    .bypass(browserMediator)

  browserMediator
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
    connector: browserConnector,
    transformer: responseTransformer
  })
}
