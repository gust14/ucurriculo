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
    // --- Modal Elements ---
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
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
            renderPreview(templateName); // A função assíncrona
            downloadBtn.disabled = false;
            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    });
    
    async function renderPreview(template) {
        try {
            // Busca o conteúdo do arquivo de template
            const response = await fetch(`templates/${template}.html`);
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o template: ${template}.html`);
            }
            let templateHtml = await response.text();

            const { personal, experience, education, skills } = resumeData;

            // Gera os blocos de HTML para seções repetidas
            const skillsHtml = skills.map(skill => `<span class="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${skill}</span>`).join('');
            const experienceHtml = experience.map(exp => `
                <div class="mb-4">
                    <h4 class="text-lg font-bold">${exp.title || ''}</h4>
                    <p class="text-sm text-cyan-700 font-semibold">${exp.company || ''}</p>
                    <p class="text-sm text-gray-600 mt-1">${exp.description || ''}</p>
                </div>`).join('');
            const educationHtml = education.map(edu => `
                <div class="mb-2">
                    <h4 class="text-md font-bold">${edu.course || ''}</h4>
                    <p class="text-sm text-gray-700">${edu.institution || ''}</p>
                    <p class="text-xs text-gray-500">${edu.period || ''}</p>
                </div>`).join('');
            
            // Substitui os placeholders no template com os dados do usuário
            templateHtml = templateHtml
                .replace(/{{fullName}}/g, personal.fullName || 'Seu Nome Aqui')
                .replace(/{{email}}/g, personal.email || '')
                .replace(/{{phone}}/g, personal.phone || '')
                .replace(/{{linkedin}}/g, personal.linkedin || '')
                .replace(/{{summary}}/g, personal.summary || '')
                .replace(/{{skillsHtml}}/g, skillsHtml)
                .replace(/{{experienceHtml}}/g, experienceHtml)
                .replace(/{{educationHtml}}/g, educationHtml);

            previewContent.innerHTML = templateHtml;
        } catch (error) {
            console.error(error);
            previewContent.innerHTML = `<p class="text-red-400">Erro ao carregar o preview. Tente novamente.</p>`;
        }
    }

    // --- PDF Download ---
  downloadBtn.addEventListener('click', () => {
        if (downloadBtn.disabled) return;
        const content = previewContent.querySelector('.resume-preview');
        // Garante que o nome do arquivo seja válido
        const userName = (resumeData.personal.fullName || 'Usuario').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const options = {
            margin: 0,
            filename: `${userName}-curriculo.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Usa 'then()' para mostrar o modal após o início do download
        html2pdf().from(content).set(options).save().then(() => {
            showSuccessModal();
        });
    });

    function showSuccessModal() {
        // Recria os ícones do Lucide dentro do modal, se necessário
        lucide.createIcons(); 
        successModal.classList.remove('hidden');
    }

    function hideSuccessModal() {
        successModal.classList.add('hidden');
    }

    // Event listeners para fechar o modal
    closeModalBtn.addEventListener('click', hideSuccessModal);
    successModal.addEventListener('click', (event) => {
        // Fecha se clicar no overlay (fundo)
        if (event.target === successModal) {
            hideSuccessModal();
        }
    });


    // Initialize form
    updateFormView();
});