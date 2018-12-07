import BodyParser from '../parser/body';
import BodyWriter from '../writer/body';
import ConnectionHeader from '../header/connection';
import ContentEncodingDecoder from '../decoder/content-encoding';
import ContentEncodingEncoder from '../encoder/content-encoding';
import ContentEncodingHeader from '../header/content-encoding';
import ContentLengthHeader from '../header/content-length';
import ContentTypeDecoder from '../decoder/content-type';
import ContentTypeEncoder from '../encoder/content-type';
import ContentTypeHeader from '../header/content-type';
import ContinueResponder from '../responder/continue';
import DateHeader from '../header/date';
import ErrorResponder from '../responder/error';
import HeaderFieldsParser from '../parser/header-fields';
import HeaderFieldsWriter from '../writer/header-fields';
import RequestLineParser from '../parser/request-line';
import ResponseLineWriter from '../writer/response-line';
import ServerConnector from '../connector/server';
import TrailerFieldsParser from '../parser/trailer-fields';
import TrailerFieldsWriter from '../writer/trailer-fields';
import TransferEncodingDecoder from '../decoder/transfer-encoding';
import TransferEncodingEncoder from '../encoder/transfer-encoding';
import TransferEncodingHeader from '../header/transfer-encoding';
import UpgradeResponder from '../responder/upgrade';

export default function createServer(options = {}) {
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
  const errorResponder = new ErrorResponder();
  const headerFieldsParser = new HeaderFieldsParser();
  const headerFieldsWriter = new HeaderFieldsWriter();
  const requestLineParser = new RequestLineParser();
  const responseLineWriter = new ResponseLineWriter();
  const serverConnector = new ServerConnector();
  const trailerFieldsParser = new TrailerFieldsParser();
  const trailerFieldsWriter = new TrailerFieldsWriter();
  const transferEncodingDecoder = new TransferEncodingDecoder();
  const transferEncodingEncoder = new TransferEncodingEncoder();
  const transferEncodingHeader = new TransferEncodingHeader();
  const upgradeResponder = new UpgradeResponder();

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

  errorResponder
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

  if ((options.log & 1) === 1) {
    serverConnector.setLog('data');
  }

  if ((options.log & 2) === 2) {
    bodyWriter.setLog('data');
  }

  return [
    serverConnector,
    contentTypeDecoder,
    errorResponder,
    bodyWriter
  ];
}
