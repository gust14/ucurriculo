document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Icons ---
    lucide.createIcons();

    // --- DOM Elements ---
    const formWizard = document.getElementById('form-wizard');
    const templateSection = document.getElementById('template-section');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const editBtn = document.getElementById('edit-btn');
    const downloadBtn = document.getElementById('download-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const previewContent = document.getElementById('resume-preview-content');
    
    // --- State Management ---
    let currentStep = 1;
    const totalSteps = steps.length;
    const resumeData = {
        personal: {},
        experience: [],
        education: [],
        skills: ''
    };

    // --- Dynamic Fields ---
    const experienceFields = document.getElementById('experience-fields');
    const addExperienceBtn = document.getElementById('add-experience');
    const educationFields = document.getElementById('education-fields');
    const addEducationBtn = document.getElementById('add-education');
    let expCount = 0;
    let eduCount = 0;

    function addExperience() {
        expCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <input type="text" data-key="title" placeholder="Cargo" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600">
            <input type="text" data-key="company" placeholder="Empresa" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600">
            <textarea data-key="description" placeholder="Descrição das atividades e resultados..." rows="3" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600"></textarea>
        `;
        experienceFields.appendChild(div);
    }

    function addEducation() {
        eduCount++;
        const div = document.createElement('div');
        div.className = 'p-4 border border-gray-700 rounded-lg space-y-3';
        div.innerHTML = `
            <input type="text" data-key="course" placeholder="Curso ou Formação" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600">
            <input type="text" data-key="institution" placeholder="Instituição" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600">
            <input type="text" data-key="period" placeholder="Período (Ex: 2018 - 2022)" class="w-full p-2 bg-gray-700 rounded-lg border border-gray-600">
        `;
        educationFields.appendChild(div);
    }

    // Add initial fields
    addExperience();
    addEducation();
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);

    // --- Form Navigation Logic ---
    function updateFormView() {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${currentStep}`).classList.add('active');

        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        prevBtn.classList.toggle('hidden', currentStep === 1);
        nextBtn.classList.toggle('hidden', currentStep === totalSteps);
        finishBtn.classList.toggle('hidden', currentStep !== totalSteps);
    }

    function saveData() {
        // Personal
        resumeData.personal.fullName = document.getElementById('fullName').value;
        resumeData.personal.email = document.getElementById('email').value;
        resumeData.personal.phone = document.getElementById('phone').value;
        resumeData.personal.linkedin = document.getElementById('linkedin').value;
        resumeData.personal.summary = document.getElementById('summary').value;

        // Experience
        resumeData.experience = [];
        experienceFields.querySelectorAll('div').forEach(expDiv => {
            const exp = {};
            expDiv.querySelectorAll('input, textarea').forEach(input => {
                exp[input.dataset.key] = input.value;
            });
            if(exp.title) resumeData.experience.push(exp);
        });

        // Education
        resumeData.education = [];
         educationFields.querySelectorAll('div').forEach(eduDiv => {
            const edu = {};
            eduDiv.querySelectorAll('input').forEach(input => {
                edu[input.dataset.key] = input.value;
            });
             if(edu.course) resumeData.education.push(edu);
        });

        // Skills
        resumeData.skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean);
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormView();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormView();
        }
    });

    finishBtn.addEventListener('click', () => {
        saveData();
        formWizard.classList.add('hidden');
        templateSection.classList.remove('hidden');
    });

    editBtn.addEventListener('click', () => {
        templateSection.classList.add('hidden');
        formWizard.classList.remove('hidden');
    });
    
    // --- Template Rendering ---
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const templateName = card.dataset.template;
            renderPreview(templateName);
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    });
    
    function renderPreview(template) {
        let html = '';
        const { personal, experience, education, skills } = resumeData;

        const skillsHtml = skills.map(skill => `<span class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${skill}</span>`).join('');

        const experienceHtml = experience.map(exp => `
            <div class="mb-4">
                <h4 class="text-lg font-bold">${exp.title || ''}</h4>
                <p class="text-sm text-cyan-700 font-semibold">${exp.company || ''}</p>
                <p class="text-sm text-gray-600 mt-1">${exp.description || ''}</p>
            </div>
        `).join('');

        const educationHtml = education.map(edu => `
            <div class="mb-2">
                <h4 class="text-md font-bold">${edu.course || ''}</h4>
                <p class="text-sm text-gray-700">${edu.institution || ''}</p>
                <p class="text-xs text-gray-500">${edu.period || ''}</p>
            </div>
        `).join('');

        switch(template) {
            case 'moderno':
                html = `
                <div class="resume-preview p-8 grid grid-cols-3 gap-8">
                    <div class="col-span-1 border-r pr-8 border-gray-200">
                         <h1 class="text-3xl font-extrabold mb-1">${personal.fullName || 'Seu Nome Aqui'}</h1>
                         <div class="space-y-4 mt-8">
                            <div>
                                <h3 class="font-bold text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-2">CONTATO</h3>
                                <p class="text-sm">${personal.email || ''}</p>
                                <p class="text-sm">${personal.phone || ''}</p>
                                <p class="text-sm">${personal.linkedin || ''}</p>
                            </div>
                            <div>
                                <h3 class="font-bold text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-2">COMPETÊNCIAS</h3>
                                <div class="flex flex-wrap gap-2 mt-2">${skillsHtml}</div>
                            </div>
                            <div>
                                <h3 class="font-bold text-cyan-600 border-b-2 border-cyan-500 pb-1 mb-2">FORMAÇÃO</h3>
                                ${educationHtml}
                            </div>
                         </div>
                    </div>
                    <div class="col-span-2">
                        <div>
                            <h3 class="text-xl font-bold border-b-2 border-gray-200 pb-2 mb-2">RESUMO</h3>
                            <p class="text-gray-600 leading-relaxed">${personal.summary || ''}</p>
                        </div>
                         <div class="mt-6">
                            <h3 class="text-xl font-bold border-b-2 border-gray-200 pb-2 mb-2">EXPERIÊNCIA</h3>
                            ${experienceHtml}
                        </div>
                    </div>
                </div>
                `;
                break;
            case 'criativo':
                 html = `
                <div class="resume-preview p-8">
                    <div class="text-center pb-6 border-b-4 border-cyan-400">
                        <h1 class="text-5xl font-extrabold">${personal.fullName || 'Seu Nome Aqui'}</h1>
                        <p class="mt-2">${personal.email} | ${personal.phone} | ${personal.linkedin}</p>
                    </div>
                    <div class="mt-6">
                        <h3 class="text-lg font-bold text-cyan-600 uppercase tracking-widest mb-2">Resumo</h3>
                        <p class="text-gray-600 leading-relaxed">${personal.summary}</p>
                    </div>
                    <div class="mt-6 grid grid-cols-3 gap-8">
                         <div class="col-span-2">
                            <h3 class="text-lg font-bold text-cyan-600 uppercase tracking-widest mb-2">Experiência</h3>
                            ${experienceHtml}
                        </div>
                        <div class="col-span-1">
                            <h3 class="text-lg font-bold text-cyan-600 uppercase tracking-widest mb-2">Competências</h3>
                            <div class="flex flex-wrap gap-2">${skillsHtml}</div>
                            <h3 class="text-lg font-bold text-cyan-600 uppercase tracking-widest mt-6 mb-2">Formação</h3>
                            ${educationHtml}
                        </div>
                    </div>
                </div>`;
                break;
            case 'minimalista':
                html = `
                <div class="resume-preview p-8">
                    <h1 class="text-4xl font-bold text-center">${personal.fullName || 'Seu Nome Aqui'}</h1>
                    <p class="text-center text-sm text-gray-500 mb-6">${personal.email} | ${personal.phone} | ${personal.linkedin}</p>
                    
                    <h2 class="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Resumo</h2>
                    <p class="text-gray-700 mb-6">${personal.summary}</p>

                    <h2 class="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Experiência</h2>
                    ${experienceHtml}
                    
                    <h2 class="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 mt-6">Formação</h2>
                    ${educationHtml}

                    <h2 class="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 mt-6">Competências</h2>
                    <div class="flex flex-wrap gap-2">${skillsHtml}</div>
                </div>
                `;
                break;
        }
        previewContent.innerHTML = html;
    }

    // --- PDF Download ---
    downloadBtn.addEventListener('click', () => {
        if (downloadBtn.disabled) return;
        const content = previewContent.querySelector('.resume-preview');
        const userName = (resumeData.personal.fullName || 'Usuario').replace(/\s+/g, '-');
        const options = {
            margin: 0,
            filename: `${userName}-CURRICULO.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(content).set(options).save();
    });


    // Initialize form
    updateFormView();
});