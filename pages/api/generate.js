import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`Write me  a three rubayis in the Omar Khayam style that includes below ideas. Each rubayi has to include 4 lines and follow below example. 
Example:

__________________***__________________   
                                 
Come, fill the Cup, and in the Fire of Spring
 The Winter Garment of Repentance fling:
   The Bird of Time has but a little way
 To fly—and Lo! the Bird is on the Wing.

Ideas: 
`


const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.83,
    max_tokens: 800,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `
  Take the below rubayi and ideas and generate a new rubayi in the style of Omar Khayam. 
  
  Ideas: ${req.body.userInput}

  Old Rubayi: ${basePromptOutput.text}

  Rubayi:
  `

   // I call the OpenAI API a second time with Prompt #2
   const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 800,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;