from datetime import datetime, timedelta

def plan_project(project_name: str, end_date_str: str, total_tasks: int = 5) -> str:
    """
    Verilen proje adı ve bitiş tarihine göre görevleri günlere böler.
    
    Args:
        project_name: Projenin adı.
        end_date_str: Bitiş tarihi (yyyy-mm-dd formatında).
        total_tasks: Toplam görev sayısı (varsayılan: 5).

    Returns:
        Günlük görevlerin listesi.
    """
    try:
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        start_date = datetime.today().date()
        if end_date <= start_date:
            return "Bitiş tarihi bugünden sonra olmalıdır."

        duration = (end_date - start_date).days + 1
        if total_tasks > duration:
            return "Görev sayısı, gün sayısından fazla olamaz."

        days_between = duration // total_tasks
        plan_lines = [f"Proje: {project_name}\nBitiş Tarihi: {end_date_str}\nToplam Gün: {duration}\n"]

        for i in range(total_tasks):
            task_day = start_date + timedelta(days=i * days_between)
            plan_lines.append(f"Gün {i + 1} ({task_day}): Görev {i + 1}")

        return "\n".join(plan_lines)
    except Exception as e:
        return f"Hata oluştu: {str(e)}"
