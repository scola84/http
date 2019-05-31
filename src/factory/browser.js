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

export default function createBrowser(codec) {
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

  const decoders = ['json', 'msgpack'];
  const encoders = ['formdata', 'json', 'msgpack', 'urlencoded'];

  for (let i = 0; i < decoders.length; i += 1) {
    const name = decoders[i];

    contentTypeDecoder
      .setStrict(false)
      .manage(codec[name].type, new codec[name].Decoder());
  }

  for (let i = 0; i < encoders.length; i += 1) {
    const name = encoders[i];

    contentTypeEncoder
      .setStrict(false)
      .manage(codec[name].type, new codec[name].Encoder());
  }

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

  return {
    connector: browserConnector,
    transformer: responseTransformer
  };
}
