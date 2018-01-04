import BodyParser from '../parser/body';
import BrowserConnector from '../connector/browser';
import BrowserMediator from '../mediator/browser';
import ContentEncodingDecoder from '../decoder/content-encoding';
import ContentEncodingEncoder from '../encoder/content-encoding';
import ContentTypeDecoder from '../decoder/content-type';
import ContentTypeEncoder from '../encoder/content-type';
import HeaderFieldsParser from '../parser/header-fields';
import ResponseLineParser from '../parser/response-line';
import ResponseTransformer from '../transformer/response';
import TrailerFieldsParser from '../parser/trailer-fields';
import TransferEncodingDecoder from '../decoder/transfer-encoding';
import TransferEncodingEncoder from '../encoder/transfer-encoding';

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

  if (typeof codec !== 'undefined') {
    contentTypeDecoder
      .setStrict(false)
      .manage(codec.type, new codec.Decoder());

    contentTypeEncoder
      .setStrict(false)
      .manage(codec.type, new codec.Encoder());
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

  return [
    browserConnector,
    responseTransformer
  ];
}
