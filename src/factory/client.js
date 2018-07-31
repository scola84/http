import BodyParser from '../parser/body';
import BodyWriter from '../writer/body';
import ClientConnector from '../connector/client';
import ClientMediator from '../mediator/client';
import ConnectionHeader from '../header/connection';
import ContentEncodingDecoder from '../decoder/content-encoding';
import ContentEncodingEncoder from '../encoder/content-encoding';
import ContentLengthHeader from '../header/content-length';
import ContentTypeDecoder from '../decoder/content-type';
import ContentTypeEncoder from '../encoder/content-type';
import ContinueResponder from '../responder/continue';
import DateHeader from '../header/date';
import HeaderFieldsParser from '../parser/header-fields';
import HeaderFieldsWriter from '../writer/header-fields';
import RequestLineWriter from '../writer/request-line';
import ResponseLineParser from '../parser/response-line';
import ResponseTransformer from '../transformer/response';
import TrailerFieldsParser from '../parser/trailer-fields';
import TrailerFieldsWriter from '../writer/trailer-fields';
import TransferEncodingDecoder from '../decoder/transfer-encoding';
import TransferEncodingEncoder from '../encoder/transfer-encoding';
import UpgradeResponder from '../responder/upgrade';

export default function createClient() {
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
    .bypass(responseTransformer);

  return [
    clientConnector,
    responseTransformer
  ];
}
