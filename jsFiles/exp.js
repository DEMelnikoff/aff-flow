

const exp = (function() {


    var p = {};

   /*
    *
    *   CONDITION ASSIGNMENT    
    *
    */


    let settings = {
        dv: 'flow',
    };

    if (settings.dv == 'happiness') {
        settings.dvText = '<strong>happy</strong> you currently feel';
    } else {
        settings.dvText = '<strong>immersed and engaged</strong> you felt while spinning the previous wheel';
    };

    jsPsych.data.addProperties({
        dv: settings.dv,
    });

    console.log(settings.dv)


   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {
        intro_preChk: [
            `<div class='parent' style='text-align:left'>
                <p><b>What makes some activities more immersive and engaging than others?</b></p>
                <p>We're interested in why people feel effortlessly engaged in some activities (such as engrossing video games), but struggle to focus on other activities.</p>
                <p>To help us, you'll play a game called <b>Spin the Wheel</b>. Throughout the game, you'll answer questions about your feelings and emotions.</p>
                <p>To learn about Spin the Wheel, continue to the next screen.</p>
            <div>`,

            `<div class='parent' style='text-align:left'>
                <p>Throughout Spin the Wheel, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.
                Specifically, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00.</p>
                <p>To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible. Continue to learn how to earn tokens!</p>
            </div>`,

            `<div class='parent'>
                <p>You'll earn tokens by spinning various prize wheels.</p>
                <p>To spin a prize wheel, just grab it with your cursor and give it a spin! Watch the animation below to see how it's done.</p>
                <img src="./img/spinGif.gif" style="width:500px">
            </div>`,

            `<div class='parent'>
                <p>The number of tokens you win for each spin depends on where the wheel lands.</p>
                <p>For example, if you land on a 6, you'll see a message like this one indicating that you earned 6 tokens.</p>
                <div class="play-area-inst">
                    <div class="win-text-inst">+6 Tokens</div>
                </div>
            </div>`,
            
            `<div class='parent'>
                <p>In addition to earning tokens from spinning, you can gain or lose tokens randomly.
                Specifically, after each spin, you have a 25% chance of winning 5 extra tokens, and a 25% chance of losing 5 tokens.</p>
            </div>`,

            `<div class='parent'>
                <p>If you see "+5 Bonus," this means you randomly won 5 extra tokens. For example, this is what you'd see if you randomly won 5 extra tokens after landing on a 6:</p>
                <div class="play-area-inst">
                    <div class="win-text-inst" style="color:green">+6 Tokens</div>
                    <div class="plus-text-inst">+5 Bonus</div>
                </div>
            </div>`,

            `<div class='parent'>
                <p>If you see "-5 Loss," this means you randomly lost 5 tokens. For example, this is what you'd see if you randomly lost 5 tokens after landing on a 6:</p>
                <div class="play-area-inst">
                    <div class="win-text-inst" style="color:green">+6 Tokens</div>
                    <div class="minus-text-inst">-5 Loss</div>
                </div>
            </div>`
        ],

        intro_postChk: [
            `<div class='parent'>
                <p>You're ready to start playing Spin the Wheel!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        postTask: [
            `<div class='parent'>
                <p>Spin the Wheel is now complete!</p>
                <p>To finish this study, please continue to answer a few final questions.</p>
            </div>`
        ],
    };

    function MakeIntro(settings) {

        const intro_preChk = {
            type: jsPsychInstructions,
            pages: html.intro_preChk,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const intro_postChk = {
            type: jsPsychInstructions,
            pages: html.intro_postChk,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        let correctAnswers = [`5`];

        if (settings.dv == 'flow') {
            correctAnswers.push(`My level of immersion and engagement.`);
        } else if (settings.dv == 'happiness') {
            correctAnswers.push(`My level of happiness.`);
        };

        const errorMessage = {
            type: jsPsychInstructions,
            pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand Spin the Wheel, please continue to re-read the instructions.</p></div>`],
            show_clickable_nav: true,
            allow_keys: false,
        };

        const attnChk = {
            type: jsPsychSurveyMultiChoice,
            preamble: `<div class='parent'>
                <p>Please answer the following questions.</p>
                </div>`,
            questions: [
                {
                    prompt: "How many times will you spin each wheel before continuing to the next wheel?", 
                    name: `attnChk1`, 
                    options: [`1`, `2`, `5`, `10`, `20`],
                },
                {
                    prompt: "What will you be answering questions about?", 
                    name: `attnChk2`, 
                    options: [`My level of happiness.`, `My level of immersion and engagement.`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                  const totalErrors = getTotalErrors(data, correctAnswers);
                  data.totalErrors = totalErrors;
            },
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [intro_preChk, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const introTimeline = {
            timeline: [instLoop, intro_postChk],
        }

        this.timeline = [introTimeline];
    }

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro = new MakeIntro(settings);

    
   /*
    *
    *   TASK
    *
    */


    // define each wedge
    const wedges = {
        two: {color:"#A6CEE3", label:"2"},
        four: {color:"#1F78B4", label:"4"},
        five: {color:"#B2DF8A", label:"5"},
        six: {color:"#33A02C", label:"6"},
        seven: {color:"#FB9A99", label:"7"},
        eight: {color:"#E31A1C", label:"8"},
        nine: {color:"#FDBF6F", label:"9"},
        eleven: {color:"#e8e83c", label:"11"},
        one: {color:"#CAB2D6", label:"1"},
        three: {color:"#6A3D9A", label:"3"},
        ten: {color:"#FF7F00", label:"10"},
        twelve: {color:"#B15928", label:"12"},
    };


    // define each wheel
    const wheels_practice = [
        /*  
            1 1 3 3        ev = 2; mad = 1
            10 10 12 12    ev = 11; mad = 1
        */
            {sectors: [ wedges.one, wedges.one, wedges.three, wedges.three ], ev: 2, mad: 1, mi: 1},
            {sectors: [ wedges.ten, wedges.ten, wedges.twelve, wedges.twelve ], ev: 11, mad: 1, mi: 1},
        /*  
            5 5 5 5       ev = 5; mad = 0
            8 8 8 8       ev = 8; mad = 0
        */
            {sectors: [ wedges.five, wedges.five, wedges.five, wedges.five ], ev: 5, mad: 0, mi: 0},
            {sectors: [ wedges.eight, wedges.eight, wedges.eight, wedges.eight ], ev: 8, mad: 0, mi: 0},
    ];

    const wheels = [
        /*  
            4 4 5 5    ev = 4.5; mad = 0.5
            8 8 9 9    ev = 8.5; mad = 0.5
            2 2 7 7    ev = 4.5; mad = 2.5
            6 6 11 11  ev = 8.5; mad = 2.5
        */
            {sectors: [ wedges.four, wedges.four, wedges.five, wedges.five ], ev: 4.5, mad: .5, mi: 1, src: "04040505", nums: ["4", "5"]},
            {sectors: [ wedges.eight, wedges.eight, wedges.nine, wedges.nine ], ev: 8.5, mad: 2.5, mi: 1, src: "08080909", nums: ["8", "9"]},
            {sectors: [ wedges.two, wedges.two, wedges.seven, wedges.seven ], ev: 4.5, mad: .5, mi: 1, src: "02020707", nums: ["2", "7"]},
            {sectors: [ wedges.six, wedges.six, wedges.eleven, wedges.eleven ], ev: 8.5, mad: 2.5, mi: 1, src: "06061111", nums: ["6", "11"]},
        /*  
            1 1 1 1       ev = 1; mad = 0
            3 3 3 3       ev = 3; mad = 0
            10 10 10 10   ev = 10; mad = 0
            12 12 12 12   ev = 12; mad = 0
        */
            {sectors: [ wedges.one, wedges.one, wedges.one, wedges.one ], ev: 1, mad: 0, mi: 0, src: "01010101", nums: ["1"]},
            {sectors: [ wedges.three, wedges.three, wedges.three, wedges.three ], ev: 3, mad: 0, mi: 0, src: "03030303", nums: ["3"]},
            {sectors: [ wedges.ten, wedges.ten, wedges.ten, wedges.ten ], ev: 10, mad: 0, mi: 0, src: "10101010", nums: ["10"]},
            {sectors: [ wedges.twelve, wedges.twelve, wedges.twelve, wedges.twelve ], ev: 12, mad: 0, mi: 0, src: "12121212", nums: ["12"]},
    ];


    let scoreTracker = 0; // track current score
    let outcome = 0; // track outcome of each spin
    let round = 0;  // track current round
    let color = null;
    let pred1, pred2, post;
    const affLabels = ['extremely negative', 'very negative', 'moderately negative', 'slightly negative', 'neither positive nor negative', 'slightly positive', 'moderately positive', 'very positive', 'extremely positive']
    const confLabels = ['0<br>not at all confident', '1', '2', '3', '4', '5', '6', '7', '8<br>completely confident']

    const makeTokenArray = function() { return jsPsych.randomization.repeat(['plus', 'minus', 'normal', 'normal'], 1) };

    let tokenArray = makeTokenArray();

    // trial: spinner
    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            createSpinner(c, spinnerData, scoreTracker, jsPsych.timelineVariable('sectors'));
        },
        canvas_size: [500, 500],
        score: function() {
            return scoreTracker
        },
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            scoreTracker = data.score;
            outcome = data.outcomes;
            color = data.colors;
        }
    };

    const tokens = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let tokenFeedback = `<div class="play-area"><div class="win-text" style="color:${color}">+${outcome} Tokens</div>{extra-text}</div>`;
            const plusText = '<div class="plus-text">+6 Bonus</div>';
            const minusText = '<div class="minus-text">-5 Loss</div>';
            const bonusType = tokenArray.pop();
            if (bonusType == 'plus') {
                tokenFeedback = tokenFeedback.replace('{extra-text}', plusText);
            } else if (bonusType == 'minus') {
                tokenFeedback = tokenFeedback.replace('{extra-text}', minusText);
            } else {
                tokenFeedback = tokenFeedback.replace('{extra-text}', '');
            };
            return tokenFeedback;
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            if (tokenArray.length == 0) {
                tokenArray = makeTokenArray();
            };
        },
    };

    // trial: flow DV
    const affect_pre = {
        type: jsPsychSurveyLikert,
        preamble: function() { 
            const wheel_html = `<img class="wheel_img" src="./img/${jsPsych.timelineVariable('src')}.png"></img>`;
            const pream_html = `<p>You're about to spin the following wheel:${wheel_html}After doing so, you'll see how many tokens you earned.</p>`
            return pream_html;
        },
        questions: function() {
            const nums = jsPsych.timelineVariable('nums');
            const q_html = [
                {prompt: `<p>If you land on a <b>${nums[0]}</b>, how do you think you'll feel upon seeing how many tokens you earned?</p>`,
                name: `affect_pre_1`,
                labels: affLabels},
            ];
            if (jsPsych.timelineVariable('mi') == 1) {
                q_html.push(
                    {prompt: `<p>If you land on a <b>${nums[1]}</b>, how do you think you'll feel upon seeing how many tokens you earned?</p>`,
                    name: `affect_pre_2`,
                    labels: affLabels}
                );
            };
            return q_html;
        },
        randomize_question_order: false,
        scale_width: 730,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            pred1 = affLabels[data.response.affect_pre_1];
            pred2 = affLabels[data.response.affect_pre_2];
            round++
            data.round = round;
            saveSurveyData(data);
        }
    };

    const confidence_pre = {
        type: jsPsychSurveyLikert,
        preamble: function() { 
            const wheel_html = `<img class="wheel_img" src="./img/${jsPsych.timelineVariable('src')}.png"></img>`;
            const pream_html = `<p>You're about to spin the following wheel:${wheel_html}After doing so, you'll see how many tokens you earned.</p>`
            return pream_html;
        },
        questions: function() {
            const nums = jsPsych.timelineVariable('nums');
            const q_html = [
                {prompt: `<p>You said that if you land on a <b>${nums[0]}</b>, you'll feel <b>${pred1}</b> upon seeing how many tokens you earned.</br>How confident are you that this is how you'd feel?</p>`,
                name: `confidence_1`,
                labels: confLabels},
            ];
            if (jsPsych.timelineVariable('mi') == 1) {
                q_html.push(
                {prompt: `<p>You said that if you land on a <b>${nums[1]}</b>, you'll feel <b>${pred2}</b> upon seeing how many tokens you earned.</br>How confident are you that this is how you'd feel?</p>`,
                    name: `confidence_2`,
                    labels: confLabels}
                );
            };
            return q_html;
        },
        randomize_question_order: false,
        post_trial_gap: 500,
        scale_width: 600,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            saveSurveyData(data);
        }
    };

    const affect_post = {
        type: jsPsychSurveyLikert,
        questions: function() {
            const Qs = [
                {prompt: `<p>You landed on a <b>${outcome}</b>. Next, you'll see how many tokens you earned.</p>When you see how many tokens you earned, how do you think you'll feel?`,
                name: `affect_post`,
                labels: affLabels},
            ];
            return Qs;
        },
        randomize_question_order: false,
        post_trial_gap: 500,
        scale_width: 730,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            post = affLabels[data.response.affect_post];
            saveSurveyData(data);
        }
    };

    const confidence_post = {
        type: jsPsychSurveyLikert,
        questions: function() {
            const Qs = [
                {prompt: `<p>You said that you'll feel <b>${post}</b> upon seeing how many tokens you earned.</br>How confident are you that this is how you'll feel?</p>`,
                name: `confidence_post`,
                labels: confLabels},
            ];
            return Qs;
        },
        randomize_question_order: false,
        post_trial_gap: 500,
        scale_width: 600,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            saveSurveyData(data);
        }
    };

    const flowMeasure = {
        type: jsPsychSurveyLikert,
        preamble: `<div style='padding-top: 50px; width: 850px; font-size:16px'>
            <p>While spinning the last wheel, how <b>immersed</b> and <b>engaged</b> did you feel?</p>
            <p>Report how immersed and engaged you felt by answering the following questions.</p></div>`,
        questions: [
            {prompt: `How <b>immersive</b> was the last wheel?`,
            name: `immersive`,
            labels: ['0<br>Not at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely']},
            {prompt: `How <b>engrossing</b> was the last wheel?`,
            name: `engrossing`,
            labels: ['0<br>Not at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely']},
            {prompt: `How <b>engaging</b> was the last wheel?`,
            name: `engaging`,
            labels: ['0<br>Not at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely']},
            {prompt: `How <b>boring</b> was the last wheel?`,
            name: `boring`,
            labels: ['0<br>Not at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely']},
        ],
        randomize_question_order: false,
        scale_width: 600,
        data: {ev: jsPsych.timelineVariable('ev'), var: jsPsych.timelineVariable('mad'), arrangement: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            saveSurveyData(data);
        }
    };


    const readyToSpin = {
        type: jsPsychInstructions,
        pages: function () {
            return [`<div class='parent'>
                <p>Next, you'll spin the following wheel 5 more times:<img class="wheel_img" src="./img/${jsPsych.timelineVariable('src')}.png"></img></p>
                <p>When you're ready, continue to the next page.</p>
            </div>`];
        },
        show_clickable_nav: true,
        post_trial_gap: 500,
        on_finish: function(data) {
            data.round = round;
        },
    };


    // timeline: main task

    const affLoop = {
        timeline: [affect_pre, confidence_pre, spin, affect_post, confidence_post, tokens, readyToSpin],
        repetitions: 1,
    };

    const flowLoop = {
        timeline: [spin, tokens],
        repetitions: 5,
    };

    p.task = {
        timeline: [affLoop, flowLoop, flowMeasure],
        repetitions: 1,
        timeline_variables: wheels,
        randomize_order: true,
    };

    p.practice = {
        timeline: [affLoop, flowLoop, flowMeasure],
        repetitions: 1,
        timeline_variables: wheels_practice,
        randomize_order: true,
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: html.postTask,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Age:", name: "age"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your race?</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
            on_finish: (data) => {
                data.ethnicity = data.response;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const pid = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Please enter your Prolific ID in the space below to receive payment.", rows: 1, columns: 50, name: "pid"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord, pid]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "ds8FfrZqysSx",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.intro, exp.practice, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
