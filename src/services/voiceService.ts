import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION;

export const speechToText = async (): Promise<string | null> => {
  return new Promise(resolve => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      AZURE_SPEECH_KEY,
      AZURE_SPEECH_REGION,
    );
    speechConfig.speechRecognitionLanguage = 'pt-BR';
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig,
    );

    textToSpeech('Faça sua consulta');
    recognizer.recognizeOnceAsync(result => {
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        resolve(result.text);
      } else {
        console.error('Erro ao reconhecer fala:', result.errorDetails);
        resolve(null);
      }
    });
  });
};

export const textToSpeech = async (texto: string): Promise<void> => {
  return new Promise(resolve => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      AZURE_SPEECH_KEY,
      AZURE_SPEECH_REGION,
    );
    speechConfig.speechSynthesisLanguage = 'pt-BR';
    speechConfig.speechSynthesisVoiceName = 'pt-BR-FranciscaNeural';
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(
      speechConfig,
      audioConfig,
    );

    synthesizer.speakTextAsync(
      texto,
      result => {
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          resolve();
        } else {
          console.error('Erro ao falar:', result.errorDetails);
          resolve();
        }
      },
      error => {
        console.error('Erro de síntese:', error);
        resolve();
      },
    );
  });
};
