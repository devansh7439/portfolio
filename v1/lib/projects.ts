import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  video?: string;
  tags?: string[];
  link?: string;
  github?: string;
}

const projectsDirectory = path.join(process.cwd(), 'projects');

export function getAllProjects(): Project[] {
  // Check if directory exists
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(projectsDirectory);
  const allProjectsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') && fileName.toLowerCase() !== 'readme.md')
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        category: matterResult.data.category || 'Project',
        description: matterResult.data.description || '',
        image: matterResult.data.image || 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
        video: matterResult.data.video || '',
        tags: matterResult.data.tags || [],
        link: matterResult.data.link || '',
        github: matterResult.data.github || '',
      };
    });

  // Filter out untitled or placeholder projects, then sort
  return allProjectsData
    .filter((project) => project.title && project.title !== 'Untitled' && project.title !== '')
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      } else {
        return 1;
      }
    });
}
