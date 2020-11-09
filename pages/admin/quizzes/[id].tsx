import {
  Box, Tab, Tabs, Typography,
} from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { ChangeEvent, useState } from 'react';

import QuizForm from '../../../components/Admin/Quizzes/QuizForm';
import Layout from '../../../components/Layout/Layout';
import TabPanel from '../../../components/TabPanel';
import { ServicesModule } from '../../../module/services.module';

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

Quiz.isAuthorized = ({ services: { accountsService } }: { services: ServicesModule }) => accountsService.hasAccess([{ 'quiz-quiz': 'write' }]);

Quiz.getInitialProps = async (ctx: any, { quizzesService }: ServicesModule) => {
  if (ctx?.query?.id && ctx?.query?.id !== 'add') {
    await quizzesService.getQuiz(ctx.query.id, { include: 'items' }).toPromise().catch((error: AxiosError) => console.warn(error.message));
  }

  return {};
};

export default Quiz;
