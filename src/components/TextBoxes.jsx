import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AnnouncementIcon from '@mui/icons-material/Announcement';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

import ShortInfo from 'components/ShortInfo';
import DownloadCSV from 'components/DownloadCSV';
import { IconTooltip } from 'components/Tooltips';

const TextBoxes = (props) => {
  const {
    downloadData,
    quoteText,
    metaText,
    consText,
    toggleInfo,
    isInfoOpen,
  } = props;

  const [boxShown, setBoxShown] = useState(null);
  useEffect(() => {
    if (isInfoOpen) {
      setBoxShown(null);
    }
  }, [isInfoOpen]);

  const clickOnBox = (name) => {
    if (name === boxShown) {
      setBoxShown(null);
    } else {
      setBoxShown(name);
    }
    if (isInfoOpen) {
      toggleInfo();
    }
  };

  return (
    <>
      <h3>
        {metaText !== '' && (
          <IconTooltip title="Metodología">
            <CollectionsBookmarkIcon
              className="graphinfo3"
              onClick={() => clickOnBox('meta')}
            />
          </IconTooltip>
        )}
        {consText !== '' && (
          <IconTooltip title="Consideraciones">
            <AnnouncementIcon
              className="graphinfo3"
              onClick={() => clickOnBox('cons')}
            />
          </IconTooltip>
        )}
        {quoteText !== '' && (
          <IconTooltip title="Autoría">
            <FormatQuoteIcon
              className="graphinfo3"
              onClick={() => clickOnBox('quote')}
            />
          </IconTooltip>
        )}
        {downloadData.length !== 0 && (
          <DownloadCSV
            className="downBtnSpecial"
            data={downloadData}
            filename="Cobertura.csv"
          />
        )}
      </h3>
      {boxShown === 'quote' && (
        <ShortInfo
          description={quoteText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === 'meta' && (
        <ShortInfo
          description={metaText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
      {boxShown === 'cons' && (
        <ShortInfo
          description={consText}
          className="graphinfo2"
          collapseButton={false}
        />
      )}
    </>
  );
};

TextBoxes.propTypes = {
  downloadData: PropTypes.array,
  quoteText: PropTypes.string,
  metaText: PropTypes.string,
  consText: PropTypes.string,
  toggleInfo: PropTypes.func,
  isInfoOpen: PropTypes.bool,
};

TextBoxes.defaultProps = {
  downloadData: [],
  quoteText: '',
  metaText: '',
  consText: '',
  toggleInfo: () => {},
  isInfoOpen: false,
};
export default TextBoxes;
