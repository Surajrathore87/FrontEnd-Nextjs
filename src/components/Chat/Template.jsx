import TemplateUsers from 'components/Modal/TemplateUsers';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { callAPI } from '_services/CallAPI';

const TemplatesLoader = dynamic(import('components/Loaders/TemplatesLoader'));
const SelectedTemplate = dynamic(import('components/Modal/SelectedTemplate'));

function Template(props) {
  const { setShowTemplate, sendMessage, showSelected, setShowSelected, isMsgSending } = props;
  const [templatesData, setTemplatesData] = useState(null);
  const [templatesPath, setTemplatesPath] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [linksPosition, setLinksPosition] = useState(null);
  const [logoPosition, setLogoPosition] = useState(null);
  const [tempInnerImage, setTempInnerImage] = useState(null);
  const [mainTempPath, setMainTempPath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplateUsers, setShowTemplateUsers] = useState(false);
  const [generateTemplatePath, setGenerateTemplatePath] = useState(null);

  useEffect(() => {
    getTemplates();
  }, []);

  function getTemplates() {
    callAPI('POST', process.env.TEMPLATES_DATA, {}, (res) => {
      if (res.status) {
        const data = res['data'];
        setTemplatesData(data);
        setTemplatesPath(data.image_path.template_image_path);
        setMainTempPath(data.image_path.main_template_image_path);
        setIsLoading(false);
      }
    });
  }

  function renderTemplates() {
    return templatesData.templates.map((item, key) => {
      return (
        <div
          key={key}
          className="template-sample cursor-pointer position-relative overflow-hidden m-2 d-inline-block"
          style={{ backgroundImage: `url(${templatesPath + item.template_merge_image})` }}
          onClick={() =>
            showSelectedImage(
              item.id,
              item.main_template_image_name,
              item.social_links_show_location,
              item.logo_show_location,
              item.image
            )
          }
        >
          <div className="template-overlay position-absolute top-0 start-0 end-0 bottom-0 w-100 h-100"></div>
          <div className="template-details position-absolute text-center w-100">
            <h3 className="text-white fw-500 fs-16">Select</h3>
          </div>
        </div>
      );
    });
  }

  function showSelectedImage(id, image, linksPosition, logoPosition, innerImage) {
    setMainImage('');
    const params = { template_id: id };
    callAPI('POST', process.env.GENERATE_TEMPLATES_DATA, params, (res) => {
      if (res.status) {
        const data = res['data'];
        setMainImage(data.new_template);
        setGenerateTemplatePath(data.image_path);
      }
    });

    setSelectedId(id);
    setShowSelected(true);
    // setLinksPosition(linksPosition);
    // setLogoPosition(logoPosition);
    // setTempInnerImage(innerImage);
  }

  return (
    <>
      {showSelected && (
        <SelectedTemplate
          mainTempPath={generateTemplatePath}
          mainImage={mainImage}
          setShowSelected={setShowSelected}
          // linksPosition={linksPosition}
          // logoPosition={logoPosition}
          // tempInnerImage={tempInnerImage}
          // templatesPath={templatesPath}
          selectedId={selectedId}
          isMsgSending={isMsgSending}
          setShowTemplateUsers={setShowTemplateUsers}
        />
      )}
      {showTemplateUsers && (
        <TemplateUsers
          setShowTemplateUsers={setShowTemplateUsers}
          isMsgSending={isMsgSending}
          sendMessage={sendMessage}
          selectedId={selectedId}
          mainImage={mainImage}
        />
      )}
      <div className="h-100 w-100 bg-white position-absolute start-0">
        <button
          onClick={() => setShowTemplate(false)}
          className="border-0 outline-none cross-btn p-0 position-absolute top-0 end-0 mt-2 me-3 bg-transparent"
        >
          <img src="/images/close-square.svg" alt="Close" width={30} />
        </button>
        <div className="mt-5 templates-list h-100">
          <div className="d-block px-lg-3 px-2">
            {!isLoading && templatesData && renderTemplates()}
            {isLoading && <TemplatesLoader />}
          </div>
        </div>
      </div>
    </>
  );
}
export default Template;
