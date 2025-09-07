import React from 'react';
import { ProfileData, Skill } from '../../../types';
import AnimatedProfileSection from '../AnimatedProfileSection';
import { 
    ReactIcon, VueIcon, NodeJsIcon, PythonIcon, TypeScriptIcon, DockerIcon, AwsIcon, WrenchScrewdriverIcon 
} from '../../icons/Icons';

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    react: ReactIcon,
    vue: VueIcon,
    nodejs: NodeJsIcon,
    python: PythonIcon,
    typescript: TypeScriptIcon,
    docker: DockerIcon,
    aws: AwsIcon,
    default: WrenchScrewdriverIcon,
};

const SkillItem: React.FC<{ skill: Skill; colorClass: string }> = ({ skill, colorClass }) => {
    const IconComponent = iconMap[skill.icon || 'default'] || iconMap.default;

    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex-shrink-0 bg-card-background border-2 border-primary rounded-full flex items-center justify-center p-2">
                <IconComponent className="w-full h-full text-primary" />
            </div>
            <div className="w-full flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-text-primary">{skill.name}</p>
                <div className="w-full bg-border-color/50 rounded-full h-2 mt-1.5">
                    <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-text-secondary">{skill.level}%</span>
            </div>
        </div>
    );
};

const SkillsSection: React.FC<{ data: ProfileData; }> = ({ data }) => (
  <AnimatedProfileSection 
    title="Skills" 
    id="skills" 
    scrollAnimation={data.settings.animations.scrollAnimation}
    viewMode={data.settings.viewMode}
  >
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-6">Frontend</h3>
        <div className="space-y-6">
          {data.skills.frontend.map(skill => (
            <SkillItem key={skill.id} skill={skill} colorClass="bg-primary" />
          ))}
        </div>
      </div>
       <div>
        <h3 className="text-xl font-semibold text-text-primary mb-6">Backend & Tools</h3>
        <div className="space-y-6">
          {[...data.skills.backend, ...data.skills.tools].map(skill => (
            <SkillItem key={skill.id} skill={skill} colorClass="bg-primary" />
          ))}
        </div>
      </div>
    </div>
  </AnimatedProfileSection>
);

export default SkillsSection;