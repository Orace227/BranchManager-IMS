// assets
import { IconFileSpreadsheet, IconHistory } from '@tabler/icons';


// constant
const icons = { IconFileSpreadsheet, IconHistory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //


const Survey = {
  id: 'Feedback',
  title: 'Feedback',
  type: 'group',
  children: [
    {
      id: 'icons',
      title: 'Survey Form',
      type: 'collapse',
      icon: icons.IconFileSpreadsheet,
      children: [
        {
          id: 'default',
          title: 'Survey Form',
          type: 'item',
          url: '/SurveyForm',
          icon: icons.IconFileSpreadsheet,
          breadcrumbs: false
        },
        {
          id: 'surveyTable',
          title: 'survey History',
          type: 'item',
          url: '/SurveyHistory',
          icon: icons.IconHistory,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default Survey;
