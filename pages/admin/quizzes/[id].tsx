import {
  Box, Tab, Tabs, Typography,
} from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

import QuizForm from '../../../components/Admin/Quizzes/QuizForm';
import Layout from '../../../components/Layout/Layout';
import { AppContextInterface } from '../../../components/Provider/AppContext';
import TabPanel from '../../../components/TabPanel';

function Quiz() {
  const [tab, setTab] = useState(0);
  const handleTab = (_event: ChangeEvent<any>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        <span>Quiz</span>
      </Typography>
      <Tabs
        value={tab}
        onChange={handleTab}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Form" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Box display="flex" flexDirection="row">
          <Box width="80%" bgcolor="grey.300">
            <QuizForm />
          </Box>
        </Box>
      </TabPanel>
    </Layout>
  );
}

Quiz.isAuthorized = ({ services: { accountsService } }: { services: AppContextInterface }) => accountsService.hasAccess([{ 'quiz-quiz': 'write' }]);

export default Quiz;
