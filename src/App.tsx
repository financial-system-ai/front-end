import { useEffect, useState, type FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import { speechToText, textToSpeech } from './services/voiceService';
import { getAIresponse } from './services/iaService';
import { convertApiCalls } from './services/apiServices';
import { usePrefersColorScheme } from './hooks/usePrefersColorScheme';

import './App.css';
import Banner from './assets/banner.jpeg';
import Logo from './assets/logo.svg';
import LogoLight from './assets/logo-light.svg';

type ActionKey = keyof typeof convertApiCalls;

const App: FC = () => {
  const [currentIcon, setCurrentIcon] = useState(faMicrophoneSlash);
  const [processing, isProcessing] = useState(false);
  const [text, setText] = useState('');
  const [reply, setReply] = useState('');

  const [scheme, setScheme] = usePrefersColorScheme();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === 'Space' && !processing && !speechSynthesis.speaking) {
        e.preventDefault();
        startApplication();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [processing]);

  const startApplication = async () => {
    isProcessing(true);
    setCurrentIcon(faMicrophone);
    try {
      const listened = await speechToText();
      if (!listened) return;
      setText(listened);

      const aiResponse = await getAIresponse(listened);
      if (!aiResponse) {
        speakAndStop('Ocorreu um erro ao processar sua solicitação.');
        return;
      }

      console.log(aiResponse);

      const result = await convertApiCalls[aiResponse.acao as ActionKey](
        aiResponse,
      );
      if (result.error) {
        speakAndStop(result.message);
        return;
      }

      setReply(result.message);
      textToSpeech(result.message);
    } catch (e) {
      console.error('Erro no fluxo:', e);
      const fallback = 'Operação não reconhecida, tente novamente.';
      setReply(fallback);
      textToSpeech(fallback);
    } finally {
      isProcessing(false);
      setCurrentIcon(faMicrophoneSlash);
    }
  };

  const speakAndStop = (message: string) => {
    textToSpeech(message);
    isProcessing(false);
    setCurrentIcon(faMicrophoneSlash);
  };

  return (
    <main>
      <button onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')}>
        <FontAwesomeIcon icon={scheme === 'light' ? faSun : faMoon} />
      </button>
      <div className="container">
        <section className="content">
          <div>
            <img className="logo" src={scheme === 'light' ? LogoLight : Logo} />
          </div>
          <div className="content-container">
            <h1>Bem Vindo!</h1>
            <span>
              Gerencie suas finanças por voz de forma rápida e fácil. Fale e
              acompanhe seus gastos, ganhos e metas.
            </span>
            {processing ? (
              <span>Processando...</span>
            ) : (
              <span>Pressione espaço para iniciar</span>
            )}
            {reply ? (
              <>
                <span>Pergunta: {text}</span>
                <span>Resposta: {reply}</span>
              </>
            ) : (
              <span></span>
            )}
            <button className="button-voice" onClick={startApplication}>
              <div className="icon-container">
                <FontAwesomeIcon icon={currentIcon} />
              </div>
            </button>
          </div>
        </section>
        <section className="other">
          <img className="banner" src={Banner} alt="" />
        </section>
      </div>
    </main>
  );
};

export default App;
